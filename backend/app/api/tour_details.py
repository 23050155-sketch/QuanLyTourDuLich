from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.dependencies import require_roles
from app.services.tour_detail_service import TourDetailService

from app.schemas.tour_detail import (
    DetailInput,
    DetailResponse,
    PolicyInput,
    PolicyResponse,
    DayInput,
    DayResponse,
    ActivityInput,
    ActivityResponse,
    MenuInput,
    MenuResponse,
    ImageInput,
    ImageResponse,
    FullTourDetailResponse,
)


router = APIRouter(tags=["Chi tiết Tour"])


def get_service(db: Session = Depends(get_db)):
    return TourDetailService(db)


@router.get(
    "/api/tours/{tour_id}/full-details",
    response_model=FullTourDetailResponse,
)
def get_full_details(
    tour_id: int,
    service: TourDetailService = Depends(get_service),
):
    return service.get_full_details(tour_id)


@router.put(
    "/api/tours/{tour_id}/details",
    response_model=DetailResponse,
    dependencies=[Depends(require_roles("admin"))],
)
def update_details(
    tour_id: int,
    data: DetailInput,
    service: TourDetailService = Depends(get_service),
):
    return service.update_details(tour_id, data)


@router.put(
    "/api/tours/{tour_id}/policies",
    response_model=PolicyResponse,
    dependencies=[Depends(require_roles("admin"))],
)
def update_policies(
    tour_id: int,
    data: PolicyInput,
    service: TourDetailService = Depends(get_service),
):
    return service.update_policies(tour_id, data)


@router.post(
    "/api/tours/{tour_id}/itinerary-days",
    response_model=DayResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("admin"))],
)
def add_day(
    tour_id: int,
    data: DayInput,
    service: TourDetailService = Depends(get_service),
):
    return service.add_day(tour_id, data)


@router.post(
    "/api/itinerary-days/{day_id}/activities",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("admin"))],
)
def add_activity(
    day_id: int,
    data: ActivityInput,
    service: TourDetailService = Depends(get_service),
):
    return service.add_activity(day_id, data)


@router.post(
    "/api/itinerary-days/{day_id}/menus",
    response_model=MenuResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("admin"))],
)
def add_menu(
    day_id: int,
    data: MenuInput,
    service: TourDetailService = Depends(get_service),
):
    return service.add_menu(day_id, data)


@router.post(
    "/api/tours/{tour_id}/images",
    response_model=ImageResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("admin"))],
)
def add_image(
    tour_id: int,
    data: ImageInput,
    service: TourDetailService = Depends(get_service),
):
    return service.add_image(tour_id, data)