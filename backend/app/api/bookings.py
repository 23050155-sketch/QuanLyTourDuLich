from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import BookingService

router = APIRouter(
    prefix="/api/bookings",
    tags=["Đặt Tour"]
)


class BookingStatusUpdate(BaseModel):
    status: Literal["confirmed", "cancelled"]


@router.get("", response_model=list[BookingResponse])
def get_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "staff"))
):
    return BookingService(db).get_all()


# Phải đặt /my trước /{booking_id} để FastAPI không hiểu "my" là ID.
@router.get("/my", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = (
        select(Booking)
        .options(selectinload(Booking.participants))
        .where(Booking.user_id == current_user.id)
        .order_by(Booking.id.desc())
    )
    return db.scalars(stmt).all()


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = BookingService(db).get_by_id(booking_id)
    if current_user.role not in ("admin", "staff") and booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xem đơn đặt Tour này")
    return booking


@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return BookingService(db).create(data, current_user.id)


@router.patch(
    "/{booking_id}/status",
    response_model=BookingResponse,
    dependencies=[Depends(require_roles("admin", "staff"))]
)
def update_booking_status(
    booking_id: int,
    data: BookingStatusUpdate,
    db: Session = Depends(get_db)
):
    return BookingService(db).update_status(booking_id, data.status)
