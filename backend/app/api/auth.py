from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    UserRegister,
    UserResponse,
    TokenResponse
)
from app.services.auth_service import AuthService
from app.core.dependencies import (
    get_current_user,
    require_roles
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Xác thực tài khoản"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(
    data: UserRegister,
    db: Session = Depends(get_db)
):
    return AuthService(db).register(data)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    return AuthService(db).login(
        form.username,
        form.password
    )


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.get(
    "/users",
    response_model=list[UserResponse]
)
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin")
    )
):
    return AuthService(db).repo.get_all()