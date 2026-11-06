from datetime import date

from sqlalchemy import Integer, Date, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TourSchedule(Base):
    __tablename__ = "tour_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    tour_id: Mapped[int] = mapped_column(
        ForeignKey("tours.id"), nullable=False
    )

    departure_date: Mapped[date] = mapped_column(Date, nullable=False)
    return_date: Mapped[date] = mapped_column(Date, nullable=False)

    capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    status: Mapped[str] = mapped_column(
        Enum("open", "closed", "cancelled"),
        default="open",
        nullable=False
    )

    tour = relationship("Tour")
    bookings = relationship("Booking", back_populates="schedule")