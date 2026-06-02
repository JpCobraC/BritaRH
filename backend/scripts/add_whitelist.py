import asyncio
import sys
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.models import RecruiterWhitelist

async def add_email(email: str):
    async with AsyncSessionLocal() as db:
        stmt = select(RecruiterWhitelist).where(RecruiterWhitelist.email == email)
        res = await db.execute(stmt)
        existing = res.scalar_one_or_none()
        
        if existing:
            existing.is_active = True
            print(f"✓ E-mail {email} já constava na whitelist. Garantido como ativo.")
        else:
            wl = RecruiterWhitelist(email=email, is_active=True)
            db.add(wl)
            print(f"✓ E-mail {email} adicionado com sucesso à whitelist.")
            
        await db.commit()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python -m scripts.add_whitelist <email>")
        sys.exit(1)
    
    email = sys.argv[1].strip().lower()
    asyncio.run(add_email(email))
