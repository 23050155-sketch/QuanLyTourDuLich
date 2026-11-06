from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.repositories.tour_detail_repository import (
    TourDetailRepository,
)


class TourDetailService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = TourDetailRepository(db)

    def ensure_tour(self, tour_id: int):
        tour = self.repo.get_tour(tour_id)
        if tour is None:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy Tour."
            )
        return tour

    def ensure_day(self, day_id: int):
        day = self.repo.get_day(day_id)
        if day is None:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy ngày lịch trình."
            )
        return day

    def save(self, operation):
        try:
            result = operation()
            self.db.commit()
            self.db.refresh(result)
            return result

        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=409,
                detail="Dữ liệu bị trùng hoặc vi phạm ràng buộc."
            )

        except Exception:
            self.db.rollback()
            raise

    def get_full_details(self, tour_id: int):
        self.ensure_tour(tour_id)
        return self.repo.get_full_details(tour_id)

    def update_details(self, tour_id: int, data):
        self.ensure_tour(tour_id)
        return self.save(
            lambda: self.repo.upsert_details(
                tour_id, data.model_dump()
            )
        )

    def update_policies(self, tour_id: int, data):
        self.ensure_tour(tour_id)
        return self.save(
            lambda: self.repo.upsert_policies(
                tour_id, data.model_dump()
            )
        )

    def add_day(self, tour_id: int, data):
        tour = self.ensure_tour(tour_id)

        if data.day_number > tour.duration_days:
            raise HTTPException(
                status_code=422,
                detail="Ngày lịch trình vượt quá số ngày của Tour."
            )

        return self.save(
            lambda: self.repo.add_day(
                tour_id, data.model_dump()
            )
        )

    def add_activity(self, day_id: int, data):
        self.ensure_day(day_id)
        return self.save(
            lambda: self.repo.add_activity(
                day_id, data.model_dump()
            )
        )

    def add_menu(self, day_id: int, data):
        self.ensure_day(day_id)
        return self.save(
            lambda: self.repo.add_menu(
                day_id, data.model_dump()
            )
        )

    def add_image(self, tour_id: int, data):
        self.ensure_tour(tour_id)
        return self.save(
            lambda: self.repo.add_image(
                tour_id, data.model_dump()
            )
        )