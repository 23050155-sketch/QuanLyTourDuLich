from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

import app.models

from app.database import engine

from app.api.auth import router as auth_router
from app.api.tours import router as tours_router
from app.api.schedules import router as schedules_router
from app.api.bookings import router as bookings_router

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Hệ thống Quản lý Tour Du lịch nội địa",
    description="RESTful API - HTTT16",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


app.include_router(auth_router)
app.include_router(tours_router)
app.include_router(schedules_router)
app.include_router(bookings_router)


@app.get("/")
def home():
    return {
        "message": "Chào mừng đến với hệ thống quản lý Tour",
        "status": "success"
    }


@app.get("/api/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "success",
            "database": "MySQL connected"
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Không thể kết nối cơ sở dữ liệu"
        )