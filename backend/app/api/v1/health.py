"""Health check router."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Retorna status da API."""
    return {"status": "ok"}
