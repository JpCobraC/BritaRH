import uuid
from typing import Any
from pydantic import BaseModel, ConfigDict, Field, field_validator


class QuestionBase(BaseModel):
    text: str = Field(..., description="O enunciado da questão")
    options: list[str] = Field(..., min_length=2, max_length=10, description="Lista de opções de resposta")
    correct_index: int = Field(..., ge=0, description="Índice da opção correta")


class QuestionCreate(QuestionBase):
    pass


class QuestionRead(QuestionBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)

    @field_validator("options", mode="before")
    @classmethod
    def convert_options_to_list(cls, v: Any) -> list[str]:
        if isinstance(v, dict):
            # Converte {"0": "A", "1": "B"} para ["A", "B"] ordenado pelas chaves
            try:
                sorted_keys = sorted(v.keys(), key=int)
                return [v[k] for k in sorted_keys]
            except (ValueError, TypeError):
                return list(v.values())
        return v
