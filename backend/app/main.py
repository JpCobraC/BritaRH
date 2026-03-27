"""FastAPI application entry point."""
from fastapi import FastAPI
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
    description="API do sistema de recrutamento e seleção da Britasul.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

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
