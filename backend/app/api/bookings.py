from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import BookingService

router = APIRouter(
    prefix="/api/bookings",
    tags=["Đặt Tour"]
)


class BookingStatusUpdate(BaseModel):
    status: Literal["confirmed", "cancelled"]


@router.get("", response_model=list[BookingResponse])
def get_bookings(db: Session = Depends(get_db)):
    return BookingService(db).get_all()


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    return BookingService(db).get_by_id(booking_id)


@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db)
):
    return BookingService(db).create(data)


@router.patch("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    data: BookingStatusUpdate,
    db: Session = Depends(get_db)
):
    return BookingService(db).update_status(
        booking_id, data.status
    )