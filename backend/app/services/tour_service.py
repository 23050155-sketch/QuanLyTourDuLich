from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.destination import Destination
from app.repositories.tour_repository import TourRepository
from app.schemas.tour import TourCreate, TourUpdate


class TourService:

    def __init__(self, db: Session):
        self.db = db
        self.repo = TourRepository(db)

    def _check_destination(self, destination_id: int):
        destination = self.db.get(Destination, destination_id)

        if not destination:
            raise HTTPException(
                status_code=404,
                detail="Địa điểm không tồn tại"
            )

    def get_all(self, keyword: str | None = None):
        return self.repo.get_all(keyword)

    def get_by_id(self, tour_id: int):
        tour = self.repo.get_by_id(tour_id)

        if not tour:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy tour"
            )

        return tour

    def create(self, data: TourCreate):
        self._check_destination(data.destination_id)

        try:
            return self.repo.create(data.model_dump())
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=409,
                detail="Không thể thêm tour do ràng buộc dữ liệu"
            )

    def update(self, tour_id: int, data: TourUpdate):
        tour = self.get_by_id(tour_id)

        values = data.model_dump(exclude_unset=True)

        if "destination_id" in values:
            if values["destination_id"] is None:
                raise HTTPException(
                    status_code=422,
                    detail="Địa điểm không được để trống"
                )
            self._check_destination(values["destination_id"])

        for field in ("name", "price", "duration_days", "status"):
            if field in values and values[field] is None:
                raise HTTPException(
                    status_code=422,
                    detail=f"{field} không được để trống"
                )

        try:
            return self.repo.update(tour, values)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=409,
                detail="Không thể cập nhật tour"
            )

    def delete(self, tour_id: int):
        tour = self.get_by_id(tour_id)

        try:
            self.repo.delete(tour)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=409,
                detail="Tour có dữ liệu liên quan, không thể xóa"
            )

        return {"message": "Xóa tour thành công"}