from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return self.db.scalar(
            select(User).where(User.email == email)
        )

    def get_by_id(self, user_id: int):
        return self.db.get(User, user_id)

    def get_all(self):
        return self.db.scalars(
            select(User).order_by(User.id.desc())
        ).all()

    def create(self, data: dict):
        user = User(**data)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user