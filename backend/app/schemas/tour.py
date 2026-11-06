from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TourCreate(BaseModel):
    destination_id: int = Field(gt=0)
    name: str = Field(min_length=3, max_length=200)
    description: str | None = None
    price: Decimal = Field(ge=0, max_digits=12, decimal_places=2)
    duration_days: int = Field(gt=0)
    season: str | None = Field(default=None, max_length=50)
    image_url: str | None = Field(default=None, max_length=500)


class TourUpdate(BaseModel):
    destination_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = None
    price: Decimal | None = Field(
        default=None, ge=0, max_digits=12, decimal_places=2
    )
    duration_days: int | None = Field(default=None, gt=0)
    season: str | None = Field(default=None, max_length=50)
    image_url: str | None = Field(default=None, max_length=500)
    status: Literal["active", "inactive"] | None = None


class TourResponse(TourCreate):
    id: int
    status: Literal["active", "inactive"]

    model_config = ConfigDict(from_attributes=True)