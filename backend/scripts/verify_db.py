import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.models import Job, RecruiterWhitelist, JobStatus

async def verify():
    async with AsyncSessionLocal() as db:
        # 1. Inserir um recrutador de teste
        recruiter = RecruiterWhitelist(email="test@britarh.com.br")
        db.add(recruiter)
        
        # 2. Inserir uma vaga de teste
        job = Job(
            title="Desenvolvedor (Teste)",
            area="TI",
            description="Vaga para validação do sistema.",
            status=JobStatus.OPEN
        )
        db.add(job)
        
        await db.commit()
        print("✓ Dados de teste inseridos.")
        
        # 3. Verificar inserção
        stmt = select(Job).where(Job.title == "Desenvolvedor (Teste)")
        result = await db.execute(stmt)
        job_db = result.scalar_one_or_none()
        if job_db:
            print(f"✓ Vaga encontrada: {job_db.title} (ID: {job_db.id})")
        else:
            print("✗ Vaga não encontrada.")

if __name__ == "__main__":
    asyncio.run(verify())
