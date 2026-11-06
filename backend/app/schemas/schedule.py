from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ScheduleCreate(BaseModel):
    tour_id: int = Field(gt=0)
    departure_date: date
    return_date: date
    capacity: int = Field(gt=0)

    @model_validator(mode="after")
    def check_dates(self):
        if self.return_date < self.departure_date:
            raise ValueError("Ngày về không được trước ngày đi")
        return self


class ScheduleUpdate(BaseModel):
    departure_date: date | None = None
    return_date: date | None = None
    capacity: int | None = Field(default=None, gt=0)
    status: Literal["open", "closed", "cancelled"] | None = None


class ScheduleResponse(ScheduleCreate):
    id: int
    status: Literal["open", "closed", "cancelled"]
    available_seats: int

    model_config = ConfigDict(from_attributes=True)