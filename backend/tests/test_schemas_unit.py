import pytest
from pydantic import ValidationError
from app.schemas.application import ApplicationBase
import uuid

def test_application_schema_score_validation():
    """Valida que o schema de candidatura exige score entre 0 e 100."""
    valid_data = {
        "job_id": uuid.uuid4(),
        "candidate_email": "test@example.com",
        "profile_data": {"full_name": "Test"},
        "score": 85
    }
    
    # Deve passar
    app = ApplicationBase(**valid_data)
    assert app.score == 85
    
    # Deve falhar (score > 100)
    with pytest.raises(ValidationError):
        ApplicationBase(**{**valid_data, "score": 101})
        
    # Deve falhar (score < 0)
    with pytest.raises(ValidationError):
        ApplicationBase(**{**valid_data, "score": -1})

def test_application_schema_email_validation():
    """Valida campos de e-mail mal formatados."""
    invalid_data = {
        "job_id": uuid.uuid4(),
        "candidate_email": "not-an-email",
        "profile_data": {},
        "score": 50
    }
    with pytest.raises(ValidationError):
        ApplicationBase(**invalid_data)
