from sqlalchemy import (
    Column, Integer, String, Text, Time,
    Boolean, ForeignKey, Enum, UniqueConstraint
)
from sqlalchemy.orm import relationship

from app.database import Base


class TourDetail(Base):
    __tablename__ = "tour_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tour_id = Column(
        Integer, ForeignKey("tours.id", ondelete="CASCADE"),
        nullable=False, unique=True
    )
    duration_text = Column(String(100))
    route = Column(String(500))
    transportation = Column(String(255))
    hotel_info = Column(String(500))
    gifts = Column(Text)
    departure_location = Column(String(500))
    notes = Column(Text)


class TourItineraryDay(Base):
    __tablename__ = "tour_itinerary_days"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tour_id = Column(
        Integer, ForeignKey("tours.id", ondelete="CASCADE"),
        nullable=False
    )
    day_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    overview = Column(Text)

    __table_args__ = (
        UniqueConstraint("tour_id", "day_number"),
    )

    activities = relationship(
        "TourItineraryActivity",
        back_populates="day",
        order_by="TourItineraryActivity.sort_order"
    )
    menus = relationship(
        "TourMenu",
        back_populates="day"
    )


class TourItineraryActivity(Base):
    __tablename__ = "tour_itinerary_activities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    itinerary_day_id = Column(
        Integer,
        ForeignKey("tour_itinerary_days.id", ondelete="CASCADE"),
        nullable=False
    )
    start_time = Column(Time)
    period = Column(
        Enum("morning", "afternoon", "evening")
    )
    title = Column(String(255), nullable=False)
    location = Column(String(255))
    description = Column(Text)
    activity_type = Column(
        Enum(
            "departure", "transport", "visit",
            "meal", "rest", "hotel", "other"
        ),
        default="other"
    )
    sort_order = Column(Integer, nullable=False, default=0)

    day = relationship(
        "TourItineraryDay",
        back_populates="activities"
    )


class TourMenu(Base):
    __tablename__ = "tour_menus"

    id = Column(Integer, primary_key=True, autoincrement=True)
    itinerary_day_id = Column(
        Integer,
        ForeignKey("tour_itinerary_days.id", ondelete="CASCADE"),
        nullable=False
    )
    meal_type = Column(
        Enum("breakfast", "lunch", "dinner"),
        nullable=False
    )
    restaurant_name = Column(String(255))
    menu_description = Column(Text)
    included = Column(Boolean, nullable=False, default=True)

    __table_args__ = (
        UniqueConstraint("itinerary_day_id", "meal_type"),
    )

    day = relationship(
        "TourItineraryDay",
        back_populates="menus"
    )


class TourPolicy(Base):
    __tablename__ = "tour_policies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tour_id = Column(
        Integer, ForeignKey("tours.id", ondelete="CASCADE"),
        nullable=False, unique=True
    )
    children_policy = Column(Text)
    price_includes = Column(Text)
    price_excludes = Column(Text)
    cancellation_policy = Column(Text)
    payment_policy = Column(Text)
    additional_notes = Column(Text)


class TourImage(Base):
    __tablename__ = "tour_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tour_id = Column(
        Integer, ForeignKey("tours.id", ondelete="CASCADE"),
        nullable=False
    )
    image_url = Column(String(1000), nullable=False)
    caption = Column(String(255))
    alt_text = Column(String(255))
    sort_order = Column(Integer, nullable=False, default=0)