"""improve_db_performance_and_integrity

Revision ID: a9b2c3d4e5f6
Revises: 1f420fdbbf49
Create Date: 2026-04-10 14:40:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a9b2c3d4e5f6'
down_revision: Union[str, None] = '1f420fdbbf49'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Update 'jobs'
    op.add_column('jobs', sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False))
    op.create_index(op.f('ix_jobs_created_at'), 'jobs', ['created_at'], unique=False)

    # 2. Update 'questions'
    op.add_column('questions', sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False))
    op.add_column('questions', sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False))
    op.create_index(op.f('ix_questions_created_at'), 'questions', ['created_at'], unique=False)
    op.create_index(op.f('ix_questions_job_id'), 'questions', ['job_id'], unique=False)

    # 3. Update 'applications'
    op.add_column('applications', sa.Column('user_id', sa.UUID(), nullable=True))
    op.add_column('applications', sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False))
    op.create_foreign_key('fk_applications_user_id', 'applications', 'users', ['user_id'], ['id'], ondelete='SET NULL')
    op.create_index(op.f('ix_applications_created_at'), 'applications', ['created_at'], unique=False)
    op.create_index(op.f('ix_applications_job_id'), 'applications', ['job_id'], unique=False)
    op.create_index(op.f('ix_applications_user_id'), 'applications', ['user_id'], unique=False)
    # GIN Index
    op.create_index('ix_applications_profile_data_gin', 'applications', ['profile_data'], postgresql_using='gin')
    # Check Constraint
    op.create_check_constraint('check_score_range', 'applications', 'score >= 0 AND score <= 100')

    # 4. Update 'users'
    op.add_column('users', sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False))
    op.create_index(op.f('ix_users_created_at'), 'users', ['created_at'], unique=False)

def downgrade() -> None:
    # users
    op.drop_index(op.f('ix_users_created_at'), table_name='users')
    op.drop_column('users', 'updated_at')

    # applications
    op.drop_constraint('check_score_range', 'applications', type_='check')
    op.drop_index('ix_applications_profile_data_gin', table_name='applications', postgresql_using='gin')
    op.drop_index(op.f('ix_applications_user_id'), table_name='applications')
    op.drop_index(op.f('ix_applications_job_id'), table_name='applications')
    op.drop_index(op.f('ix_applications_created_at'), table_name='applications')
    op.drop_constraint('fk_applications_user_id', 'applications', type_='foreignkey')
    op.drop_column('applications', 'updated_at')
    op.drop_column('applications', 'user_id')

    # questions
    op.drop_index(op.f('ix_questions_job_id'), table_name='questions')
    op.drop_index(op.f('ix_questions_created_at'), table_name='questions')
    op.drop_column('questions', 'updated_at')
    op.drop_column('questions', 'created_at')

    # jobs
    op.drop_index(op.f('ix_jobs_created_at'), table_name='jobs')
    op.drop_column('jobs', 'updated_at')
