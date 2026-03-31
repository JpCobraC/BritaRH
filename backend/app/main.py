"""FastAPI application entry point."""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import (
    health,
    jobs,
    recruiter,
    applications,
)
from app.core.config import settings

app = FastAPI(
    title="BritaRH API",
    description="Backend para plataforma de Recrutamento BritaRH",
    version="1.0.0",
)

# ─── Middleware de Headers de Segurança ───────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Adiciona cabeçalhos de segurança em todas as respostas."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(jobs.router, prefix="/api/v1/jobs", tags=["Jobs"])
app.include_router(recruiter.router, prefix="/api/v1/recruiter", tags=["Recruiter Dashboard"])
app.include_router(applications.router, prefix="/api/v1/applications", tags=["Candidate Applications"])
