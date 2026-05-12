import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities import User as DomainUser, UserRole
from app.domain.interfaces import IUserRepository
from app.models.models import User as ModelUser


class UserRepository(IUserRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    def _to_domain(self, model: ModelUser) -> DomainUser:
        return DomainUser(
            id=model.id,
            email=model.email,
            name=model.name,
            role=UserRole(model.role),
            hashed_password=model.hashed_password,
            cpf=model.cpf,
            birth_date=model.birth_date,
            picture=model.picture,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, domain: DomainUser) -> ModelUser:
        return ModelUser(
            id=domain.id,
            email=domain.email,
            name=domain.name,
            role=domain.role.value,
            hashed_password=domain.hashed_password,
            cpf=domain.cpf,
            birth_date=domain.birth_date,
            picture=domain.picture,
            created_at=domain.created_at,
            updated_at=domain.updated_at,
        )

    async def create(self, user: DomainUser) -> DomainUser:
        model = self._to_model(user)
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_domain(model)

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[DomainUser]:
        stmt = select(ModelUser).where(ModelUser.id == user_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        if not model:
            return None
        return self._to_domain(model)

    async def get_by_email(self, email: str) -> Optional[DomainUser]:
        stmt = select(ModelUser).where(ModelUser.email == email)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        if not model:
            return None
        return self._to_domain(model)

    async def get_by_cpf(self, cpf: str) -> Optional[DomainUser]:
        stmt = select(ModelUser).where(ModelUser.cpf == cpf)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        if not model:
            return None
        return self._to_domain(model)
