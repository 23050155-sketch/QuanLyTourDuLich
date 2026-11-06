from datetime import date

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tour import Tour
from app.repositories.schedule_repository import ScheduleRepository
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate


class ScheduleService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ScheduleRepository(db)

    def to_response(self, schedule):
        reserved = self.repo.reserved_seats(schedule.id)
        return {
            "id": schedule.id,
            "tour_id": schedule.tour_id,
            "departure_date": schedule.departure_date,
            "return_date": schedule.return_date,
            "capacity": schedule.capacity,
            "status": schedule.status,
            "available_seats": max(0, schedule.capacity - reserved)
        }

    def get_all(self):
        return [self.to_response(s) for s in self.repo.get_all()]

    def get_by_id(self, schedule_id: int):
        schedule = self.repo.get_by_id(schedule_id)
        if not schedule:
            raise HTTPException(404, "Không tìm thấy lịch khởi hành")
        return self.to_response(schedule)

    def create(self, data: ScheduleCreate):
        if not self.db.get(Tour, data.tour_id):
            raise HTTPException(404, "Tour không tồn tại")

        if data.departure_date < date.today():
            raise HTTPException(422, "Ngày khởi hành đã qua")

        schedule = self.repo.create(data.model_dump())
        return self.to_response(schedule)

    def update(self, schedule_id: int, data: ScheduleUpdate):
        try:
            schedule = self.repo.get_by_id(schedule_id, lock=True)
            if not schedule:
                raise HTTPException(404, "Không tìm thấy lịch khởi hành")

            values = data.model_dump(exclude_unset=True)

            for field in ("departure_date", "return_date", "capacity", "status"):
                if field in values and values[field] is None:
                    raise HTTPException(422, f"{field} không được để trống")

            departure = values.get("departure_date", schedule.departure_date)
            return_date = values.get("return_date", schedule.return_date)
            capacity = values.get("capacity", schedule.capacity)

            if return_date < departure:
                raise HTTPException(422, "Ngày về không được trước ngày đi")

            if departure < date.today():
                raise HTTPException(422, "Ngày khởi hành đã qua")

            reserved = self.repo.reserved_seats(schedule.id)
            if capacity < reserved:
                raise HTTPException(
                    409, "Sức chứa không được nhỏ hơn số chỗ đã đặt"
                )

            if values.get("status") == "cancelled" and reserved > 0:
                raise HTTPException(
                    409, "Cần xử lý các đơn đặt trước khi hủy lịch"
                )

            for key, value in values.items():
                setattr(schedule, key, value)

            self.db.commit()
            self.db.refresh(schedule)
            return self.to_response(schedule)

        except Exception:
            self.db.rollback()
            raise