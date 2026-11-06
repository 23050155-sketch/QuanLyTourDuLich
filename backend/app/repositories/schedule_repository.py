from sqlalchemy import select, func, case
from sqlalchemy.orm import Session

from app.models.schedule import TourSchedule
from app.models.booking import Booking


class ScheduleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, schedule_id: int, lock=False):
        stmt = select(TourSchedule).where(
            TourSchedule.id == schedule_id
        )
        if lock:
            stmt = stmt.with_for_update()

        return self.db.scalar(stmt)

    def get_all(self):
        return self.db.scalars(
            select(TourSchedule).order_by(
                TourSchedule.departure_date
            )
        ).all()

    def reserved_seats(self, schedule_id: int):
        stmt = select(
            func.coalesce(func.sum(Booking.quantity), 0)
        ).where(
            Booking.schedule_id == schedule_id,
            Booking.status.in_(["pending", "confirmed"])
        )
        return int(self.db.scalar(stmt) or 0)

    def create(self, data: dict):
        schedule = TourSchedule(**data)
        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)
        return schedule

    def update(self, schedule: TourSchedule, values: dict):
        for key, value in values.items():
            setattr(schedule, key, value)

        self.db.commit()
        self.db.refresh(schedule)
        return schedule