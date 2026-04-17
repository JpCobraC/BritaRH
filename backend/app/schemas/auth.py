from datetime import date
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.models import UserRole

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    name: str = Field(..., min_length=2, max_length=255)
    cpf: str = Field(..., min_length=11, max_length=14) # Permite 11 dígitos ou formatado com máscara 
    birth_date: date
    role: UserRole = UserRole.CANDIDATE

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    email: EmailStr
    name: str
    role: UserRole
    picture: str | None = None

class Token(BaseModel):
    """Schema para retorno de token de acesso."""
    access_token: str
    token_type: str
    user: UserRead

class TokenData(BaseModel):
    """Schema para dados contidos no payload do token."""
    email: str | None = None
    name: str | None = None
