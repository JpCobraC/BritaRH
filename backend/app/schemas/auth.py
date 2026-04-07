from datetime import date
from pydantic import BaseModel, EmailStr, Field
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
    email: EmailStr
    name: str
    role: UserRole
    picture: str | None = None

    class Config:
        from_attributes = True
