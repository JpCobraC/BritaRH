import json
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import Application, Job
from app.schemas.application import ApplicationRead
from app.services.storage import storage_service

router = APIRouter()


@router.post("/submit", response_model=ApplicationRead)
async def submit_application(
    job_id: Annotated[uuid.UUID, Form(...)],
    candidate_email: Annotated[EmailStr, Form(...)],
    profile_data: Annotated[str, Form(...)],
    score: Annotated[int, Form(...)],
    db: Annotated[AsyncSession, Depends(get_db)],
    file: UploadFile = File(...),
    message: Annotated[str | None, Form()] = None,
):
    """
    Submete uma candidatura completa: dados do perfil, resultado do teste e currículo (PDF).
    Garante que não haja duplicidade de candidatura para a mesma vaga.
    """
    
    # 1. Validação de formato de arquivo
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Apenas arquivos PDF são aceitos para o currículo."
        )

    # 2. Verifica se a vaga existe
    job = await db.get(Job, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vaga não encontrada."
        )

    # 3. Verifica duplicidade (E-mail + Vaga)
    query = select(Application).where(
        Application.job_id == job_id,
        Application.candidate_email == candidate_email
    )
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Você já se candidatou para esta vaga."
        )

    # 4. Processa JSON de perfil
    try:
        profile_json = json.loads(profile_data)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Dados de perfil inválidos (formato JSON esperado)."
        )

    # 5. Upload para MinIO
    file_content = await file.read()
    try:
        object_key = storage_service.upload_file(
            file_content=file_content,
            filename=file.filename or f"resume_{uuid.uuid4()}.pdf",
            content_type="application/pdf"
        )
    except Exception as e:
        # TODO: Logging real aqui
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao salvar currículo: {str(e)}"
        )

    # 6. Salva no Banco de Dados
    new_app = Application(
        job_id=job_id,
        candidate_email=candidate_email,
        profile_data=profile_json,
        score=score,
        message=message,
        resume_url=object_key
    )
    
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)
    
    return new_app
