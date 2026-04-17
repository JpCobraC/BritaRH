import asyncio
import uuid
from datetime import date
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.models import User, UserRole, Job, JobStatus, Question, RecruiterWhitelist
from app.services.auth import hash_password

async def seed():
    # 0. Criar tabelas se não existirem
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Banco de dados inicializado.")

    async with AsyncSessionLocal() as db:
        # 1. Criar Recrutador
        stmt = select(User).where(User.email == "recrutador@britarh.com.br")
        result = await db.execute(stmt)
        if not result.scalar_one_or_none():
            recruiter = User(
                email="recrutador@britarh.com.br",
                hashed_password=hash_password("britarh123"),
                name="Recrutador BritaRH",
                cpf="11122233344",
                birth_date=date(1990, 1, 1),
                role=UserRole.RECRUITER
            )
            db.add(recruiter)
            print("Recrutador criado: recrutador@britarh.com.br / britarh123")

        # 1.1 Registrar na Whitelist
        stmt = select(RecruiterWhitelist).where(RecruiterWhitelist.email == "recrutador@britarh.com.br")
        result = await db.execute(stmt)
        if not result.scalar_one_or_none():
            whitelist = RecruiterWhitelist(email="recrutador@britarh.com.br")
            db.add(whitelist)
            print("Email adicionado à Whitelist de Recrutadores.")

        # 2. Criar Candidato
        stmt = select(User).where(User.email == "candidato@gmail.com")
        result = await db.execute(stmt)
        if not result.scalar_one_or_none():
            candidate = User(
                email="candidato@gmail.com",
                hashed_password=hash_password("candidato123"),
                name="João Candidato",
                cpf="55566677788",
                birth_date=date(2000, 5, 20),
                role=UserRole.CANDIDATE
            )
            db.add(candidate)
            print("Candidato criado: candidato@gmail.com / candidato123")

        # 3. Criar uma vaga de exemplo se não houver
        stmt = select(Job).limit(1)
        result = await db.execute(stmt)
        if not result.scalar_one_or_none():
            job = Job(
                title="Desenvolvedor Fullstack Senior",
                area="Tecnologia",
                description="Vaga para desenvolvedor com experiência em FastAPI e React.",
                contract_type="PJ",
                schedule="Flexível",
                workplace="Remoto",
                requirements="Python, TypeScript, SQL",
                assignments="Liderar time técnico",
                status=JobStatus.OPEN
            )
            # Adicionar 5 questões para respeitar o validador Pydantic
            for i in range(5):
                job.questions.append(
                    Question(
                        text=f"Questão Técnica {i+1} de exemplo?",
                        options={"0": "Errada", "1": "Correta", "2": "Incompleta"},
                        correct_index=1
                    )
                )
            db.add(job)
            print("Vaga de exemplo criada (5 questões).")

        await db.commit()

if __name__ == "__main__":
    asyncio.run(seed())
