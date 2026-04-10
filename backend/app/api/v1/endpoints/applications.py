import json
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import Application, Job, User
from app.schemas.application import ApplicationRead, ApplicationProfile
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
    
    # 1. Validação de formato de arquivo e tamanho (5MB max)
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 Megabytes
    
    if file.content_type != "application/pdf" or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Apenas arquivos PDF são aceitos para o currículo."
        )

    # Verifica o tamanho do arquivo
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"O currículo deve ter no máximo 5MB. Tamanho enviado: {file_size / (1024 * 1024):.2f}MB"
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

    # 4. Validar dados de perfil com Pydantic
    try:
        profile_obj = ApplicationProfile.model_validate_json(profile_data)
        profile_json = profile_obj.model_dump()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Dados de perfil inválidos: {str(e)}"
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
    # Tenta encontrar o usuário pelo e-mail para vincular a candidatura
    user_query = select(User).where(User.email == candidate_email)
    user_result = await db.execute(user_query)
    found_user = user_result.scalar_one_or_none()
    user_id = found_user.id if found_user else None

    new_app = Application(
        job_id=job_id,
        user_id=user_id,
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
