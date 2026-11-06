from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Integer, String, DateTime, ForeignKey,
    DECIMAL, Enum, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )

    schedule_id: Mapped[int] = mapped_column(
        ForeignKey("tour_schedules.id"), nullable=False
    )

    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    total_price: Mapped[Decimal] = mapped_column(
        DECIMAL(12, 2), nullable=False
    )

    status: Mapped[str] = mapped_column(
        Enum("pending", "confirmed", "cancelled"),
        default="pending",
        nullable=False
    )

    booking_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.current_timestamp()
    )

    schedule = relationship("TourSchedule", back_populates="bookings")
    participants = relationship(
        "BookingParticipant", back_populates="booking"
    )


class BookingParticipant(Base):
    __tablename__ = "booking_participants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    booking_id: Mapped[int] = mapped_column(
        ForeignKey("bookings.id"), nullable=False
    )

    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20))

    booking = relationship("Booking", back_populates="participants")