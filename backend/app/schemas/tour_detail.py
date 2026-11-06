from datetime import time
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class DetailInput(BaseModel):
    duration_text: str | None = None
    route: str | None = None
    transportation: str | None = None
    hotel_info: str | None = None
    gifts: str | None = None
    departure_location: str | None = None
    notes: str | None = None


class DetailResponse(DetailInput):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tour_id: int


class PolicyInput(BaseModel):
    children_policy: str | None = None
    price_includes: str | None = None
    price_excludes: str | None = None
    cancellation_policy: str | None = None
    payment_policy: str | None = None
    additional_notes: str | None = None


class PolicyResponse(PolicyInput):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tour_id: int


class ActivityInput(BaseModel):
    start_time: time | None = None
    period: Literal["morning", "afternoon", "evening"] | None = None
    title: str = Field(min_length=1, max_length=255)
    location: str | None = None
    description: str | None = None
    activity_type: Literal[
        "departure", "transport", "visit",
        "meal", "rest", "hotel", "other"
    ] = "other"
    sort_order: int = Field(default=0, ge=0)


class ActivityResponse(ActivityInput):
    model_config = ConfigDict(from_attributes=True)

    id: int
    itinerary_day_id: int


class MenuInput(BaseModel):
    meal_type: Literal["breakfast", "lunch", "dinner"]
    restaurant_name: str | None = None
    menu_description: str | None = None
    included: bool = True


class MenuResponse(MenuInput):
    model_config = ConfigDict(from_attributes=True)

    id: int
    itinerary_day_id: int


class DayInput(BaseModel):
    day_number: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=255)
    overview: str | None = None


class DayResponse(DayInput):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tour_id: int
    activities: list[ActivityResponse] = Field(default_factory=list)
    menus: list[MenuResponse] = Field(default_factory=list)


class ImageInput(BaseModel):
    image_url: str = Field(min_length=1, max_length=1000)
    caption: str | None = None
    alt_text: str | None = None
    sort_order: int = Field(default=0, ge=0)


class ImageResponse(ImageInput):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tour_id: int


class FullTourDetailResponse(BaseModel):
    tour_id: int
    details: DetailResponse | None = None
    policies: PolicyResponse | None = None
    itinerary: list[DayResponse] = Field(default_factory=list)
    images: list[ImageResponse] = Field(default_factory=list)