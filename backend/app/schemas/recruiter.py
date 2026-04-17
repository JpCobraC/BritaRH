from pydantic import BaseModel

class RecruiterStats(BaseModel):
    total_jobs: int
    active_jobs: int
    total_applications: int
    new_applications_today: int
