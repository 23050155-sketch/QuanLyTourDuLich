from sqlalchemy.orm import Session, selectinload

from app.models.tour import Tour
from app.models.tour_detail import (
    TourDetail,
    TourItineraryDay,
    TourItineraryActivity,
    TourMenu,
    TourPolicy,
    TourImage,
)


class TourDetailRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_tour(self, tour_id: int):
        return self.db.get(Tour, tour_id)

    def get_full_details(self, tour_id: int):
        details = (
            self.db.query(TourDetail)
            .filter(TourDetail.tour_id == tour_id)
            .first()
        )

        policies = (
            self.db.query(TourPolicy)
            .filter(TourPolicy.tour_id == tour_id)
            .first()
        )

        days = (
            self.db.query(TourItineraryDay)
            .options(
                selectinload(TourItineraryDay.activities),
                selectinload(TourItineraryDay.menus),
            )
            .filter(TourItineraryDay.tour_id == tour_id)
            .order_by(TourItineraryDay.day_number)
            .all()
        )

        images = (
            self.db.query(TourImage)
            .filter(TourImage.tour_id == tour_id)
            .order_by(TourImage.sort_order, TourImage.id)
            .all()
        )

        return {
            "tour_id": tour_id,
            "details": details,
            "policies": policies,
            "itinerary": days,
            "images": images,
        }

    def upsert_details(self, tour_id: int, data: dict):
        obj = (
            self.db.query(TourDetail)
            .filter_by(tour_id=tour_id)
            .first()
        )

        if obj is None:
            obj = TourDetail(tour_id=tour_id, **data)
            self.db.add(obj)
        else:
            for key, value in data.items():
                setattr(obj, key, value)

        self.db.flush()
        return obj

    def upsert_policies(self, tour_id: int, data: dict):
        obj = (
            self.db.query(TourPolicy)
            .filter_by(tour_id=tour_id)
            .first()
        )

        if obj is None:
            obj = TourPolicy(tour_id=tour_id, **data)
            self.db.add(obj)
        else:
            for key, value in data.items():
                setattr(obj, key, value)

        self.db.flush()
        return obj

    def add_day(self, tour_id: int, data: dict):
        obj = TourItineraryDay(tour_id=tour_id, **data)
        self.db.add(obj)
        self.db.flush()
        return obj

    def get_day(self, day_id: int):
        return self.db.get(TourItineraryDay, day_id)

    def add_activity(self, day_id: int, data: dict):
        obj = TourItineraryActivity(
            itinerary_day_id=day_id, **data
        )
        self.db.add(obj)
        self.db.flush()
        return obj

    def add_menu(self, day_id: int, data: dict):
        obj = TourMenu(itinerary_day_id=day_id, **data)
        self.db.add(obj)
        self.db.flush()
        return obj

    def add_image(self, tour_id: int, data: dict):
        obj = TourImage(tour_id=tour_id, **data)
        self.db.add(obj)
        self.db.flush()
        return obj