from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.booking import Booking, BookingParticipant


class BookingRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.scalars(
            select(Booking)
            .options(selectinload(Booking.participants))
            .order_by(Booking.id.desc())
        ).all()

    def get_by_id(self, booking_id: int):
        return self.db.scalar(
            select(Booking)
            .options(selectinload(Booking.participants))
            .where(Booking.id == booking_id)
        )

    def create(self, booking_data: dict, participants: list[dict]):
        booking = Booking(**booking_data)
        booking.participants = [
            BookingParticipant(**item)
            for item in participants
        ]

        self.db.add(booking)
        self.db.flush()
        return booking