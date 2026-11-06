from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserRegister
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = UserRepository(db)

    def register(self, data: UserRegister):
        email = str(data.email).lower()

        if self.repo.get_by_email(email):
            raise HTTPException(
                status_code=409,
                detail="Email đã được sử dụng"
            )

        user_data = {
            "full_name": data.full_name,
            "email": email,
            "password_hash": hash_password(data.password),
            "phone": data.phone,
            "role": "customer"
        }

        try:
            return self.repo.create(user_data)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=409,
                detail="Email đã được sử dụng"
            )

    def login(self, email: str, password: str):
        user = self.repo.get_by_email(email.lower())

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Email hoặc mật khẩu không chính xác"
            )

        try:
            valid = verify_password(
                password, user.password_hash
            )
        except (ValueError, TypeError):
            valid = False

        if not valid:
            raise HTTPException(
                status_code=401,
                detail="Email hoặc mật khẩu không chính xác"
            )

        token = create_access_token(user.id)

        return {
            "access_token": token,
            "token_type": "bearer"
        }