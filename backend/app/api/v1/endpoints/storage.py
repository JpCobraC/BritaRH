from fastapi import APIRouter, HTTPException, status
from fastapi.responses import RedirectResponse

from app.services.storage import storage_service

router = APIRouter()

@router.get("/download/{object_key}")
async def download_resume(object_key: str):
    """Redireciona para uma URL pré-assinada do MinIO para download do currículo."""
    try:
        presigned_url = storage_service.get_presigned_url(object_key)
        return RedirectResponse(presigned_url)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Arquivo não encontrado ou link expirado.",
        ) from exc
