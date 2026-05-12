import asyncio
import logging

logger = logging.getLogger(__name__)

async def send_confirmation_email(candidate_name: str, candidate_email: str, job_title: str):
    """
    Mock service to simulate sending a confirmation email.
    """
    logger.info(f"Preparing to send confirmation email to {candidate_name} ({candidate_email}) for job '{job_title}'")
    
    # Simulate network delay for sending email
    await asyncio.sleep(2)
    
    logger.info(f"SUCCESS: Confirmation email sent to {candidate_email}")
