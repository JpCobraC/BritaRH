"""Pacote da API v1."""
from app.api.v1 import health
from app.api.v1.endpoints import jobs, recruiter, applications

__all__ = ["health", "jobs", "recruiter", "applications"]
