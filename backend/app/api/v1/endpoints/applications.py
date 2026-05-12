import uuid
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import EmailStr

from app.api import deps
from app.schemas.application import ApplicationRead
from app.usecases.application_usecases import SubmitApplicationUseCase
from app.services.email import send_confirmation_email

router = APIRouter()


@router.post("/submit", response_model=ApplicationRead)
async def submit_application(
    job_id: Annotated[uuid.UUID, Form(...)],
    candidate_email: Annotated[EmailStr, Form(...)],
    profile_data: Annotated[str, Form(...)],
    score: Annotated[int, Form(...)],
    usecase: Annotated[SubmitApplicationUseCase, Depends(deps.get_submit_application_usecase)],
    background_tasks: BackgroundTasks,
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

    file_content = await file.read()
    
    try:
        new_app = await usecase.execute(
            job_id=job_id,
            candidate_email=candidate_email,
            profile_data_json=profile_data,
            score=score,
            file_content=file_content,
            filename=file.filename or f"resume_{uuid.uuid4()}.pdf",
            message=message
        )
        
        # Envia e-mail de confirmação em background
        # Usamos job_id para o título pois não temos o title da vaga retornado,
        # mas na vida real buscaríamos o title (ou ele viria no ApplicationRead).
        job_title = f"Vaga {new_app.job_id}"
        candidate_name = new_app.profile_data.get("name", "Candidato") if isinstance(new_app.profile_data, dict) else "Candidato"
        background_tasks.add_task(
            send_confirmation_email,
            candidate_name=candidate_name,
            candidate_email=new_app.candidate_email,
            job_title=job_title
        )
        
        return new_app
    except ValueError as e:
        # Erros de validação (ex: duplicidade, vaga não existe, JSON inválido)
        # O Usecase poderia lançar exceções customizadas para mapear os status codes com precisão,
        # Mas vamos simplificar usando 400 Bad Request / 409 Conflict onde aplicável
        err_msg = str(e)
        if "já se candidatou" in err_msg:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=err_msg)
        if "Vaga não encontrada" in err_msg:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=err_msg)
        if "perfil inválido" in err_msg:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err_msg)
        
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=err_msg)
    except RuntimeError as e:
        # Erros de infraestrutura (MinIO, etc)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
