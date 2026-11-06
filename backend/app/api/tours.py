from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.tour import TourCreate, TourUpdate, TourResponse
from app.services.tour_service import TourService

router = APIRouter(prefix="/api/tours", tags=["Tours"])


@router.get("", response_model=list[TourResponse])
def get_tours(
    keyword: str | None = Query(default=None),
    db: Session = Depends(get_db)
):
    return TourService(db).get_all(keyword)


@router.get("/{tour_id}", response_model=TourResponse)
def get_tour(tour_id: int, db: Session = Depends(get_db)):
    return TourService(db).get_by_id(tour_id)


@router.post("", response_model=TourResponse, status_code=201)
def create_tour(
    data: TourCreate,
    db: Session = Depends(get_db)
):
    return TourService(db).create(data)


@router.put("/{tour_id}", response_model=TourResponse)
def update_tour(
    tour_id: int,
    data: TourUpdate,
    db: Session = Depends(get_db)
):
    return TourService(db).update(tour_id, data)


@router.delete("/{tour_id}")
def delete_tour(tour_id: int, db: Session = Depends(get_db)):
    return TourService(db).delete(tour_id)