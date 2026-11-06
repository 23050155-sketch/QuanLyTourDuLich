from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.schedule import (
    ScheduleCreate, ScheduleUpdate, ScheduleResponse
)
from app.services.schedule_service import ScheduleService

router = APIRouter(
    prefix="/api/schedules",
    tags=["Lịch khởi hành"]
)


@router.get("", response_model=list[ScheduleResponse])
def get_schedules(db: Session = Depends(get_db)):
    return ScheduleService(db).get_all()


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(schedule_id: int, db: Session = Depends(get_db)):
    return ScheduleService(db).get_by_id(schedule_id)


@router.post("", response_model=ScheduleResponse, status_code=201)
def create_schedule(
    data: ScheduleCreate,
    db: Session = Depends(get_db)
):
    return ScheduleService(db).create(data)


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: int,
    data: ScheduleUpdate,
    db: Session = Depends(get_db)
):
    return ScheduleService(db).update(schedule_id, data)