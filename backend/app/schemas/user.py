from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None
    picture: str | None = None


class User(UserBase):
    is_recruiter: bool = False
