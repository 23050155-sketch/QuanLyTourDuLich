from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ParticipantCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    phone: str | None = Field(default=None, max_length=20)


class BookingCreate(BaseModel):
    schedule_id: int = Field(gt=0)
    participants: list[ParticipantCreate] = Field(min_length=1)


class ParticipantResponse(ParticipantCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class BookingResponse(BaseModel):
    id: int
    user_id: int
    schedule_id: int
    quantity: int
    total_price: Decimal
    status: Literal["pending", "confirmed", "cancelled"]
    booking_date: datetime
    participants: list[ParticipantResponse]

    model_config = ConfigDict(from_attributes=True)