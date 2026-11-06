from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tour import Tour


class TourRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all(self, keyword: str | None = None):
        stmt = select(Tour)

        if keyword:
            stmt = stmt.where(
                Tour.name.ilike(f"%{keyword}%")
            )

        return self.db.scalars(
            stmt.order_by(Tour.id.desc())
        ).all()

    def get_by_id(self, tour_id: int):
        return self.db.get(Tour, tour_id)

    def create(self, data: dict):
        tour = Tour(**data)
        self.db.add(tour)
        self.db.commit()
        self.db.refresh(tour)
        return tour

    def update(self, tour: Tour, data: dict):
        for key, value in data.items():
            setattr(tour, key, value)

        self.db.commit()
        self.db.refresh(tour)
        return tour

    def delete(self, tour: Tour):
        self.db.delete(tour)
        self.db.commit()