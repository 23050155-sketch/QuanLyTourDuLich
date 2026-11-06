from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.tour import Tour
from app.models.booking import Booking
from app.repositories.schedule_repository import ScheduleRepository
from app.repositories.booking_repository import BookingRepository
from app.schemas.booking import BookingCreate

import logging

logger = logging.getLogger(__name__)


class BookingService:
    def __init__(self, db: Session):
        self.db = db
        self.schedule_repo = ScheduleRepository(db)
        self.booking_repo = BookingRepository(db)

    def get_all(self):
        return self.booking_repo.get_all()

    def get_by_id(self, booking_id: int):
        booking = self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise HTTPException(404, "Không tìm thấy đơn đặt Tour")
        return booking

    def create(self, data: BookingCreate):
        try:
            # Khóa lịch khởi hành trong giao dịch MySQL
            schedule = self.schedule_repo.get_by_id(
                data.schedule_id, lock=True
            )

            if not schedule:
                raise HTTPException(404, "Lịch khởi hành không tồn tại")

            if schedule.status != "open":
                raise HTTPException(409, "Lịch khởi hành không nhận đặt Tour")

            from datetime import date
            if schedule.departure_date < date.today():
                raise HTTPException(409, "Tour đã khởi hành")

            # Kiểm tra khách hàng
            from sqlalchemy import text
            user = self.db.execute(
                text("SELECT id FROM users WHERE id = :id"),
                {"id": data.user_id}
            ).first()

            if not user:
                raise HTTPException(404, "Tài khoản khách hàng không tồn tại")

            quantity = len(data.participants)
            reserved = self.schedule_repo.reserved_seats(schedule.id)
            available = schedule.capacity - reserved

            if quantity > available:
                raise HTTPException(
                    409,
                    f"Không đủ chỗ. Hiện chỉ còn {available} chỗ"
                )

            tour = self.db.get(Tour, schedule.tour_id)
            total_price = Decimal(tour.price) * quantity

            booking = self.booking_repo.create(
                {
                    "user_id": data.user_id,
                    "schedule_id": schedule.id,
                    "quantity": quantity,
                    "total_price": total_price,
                    "status": "pending"
                },
                [p.model_dump() for p in data.participants]
            )

            booking_id = booking.id
            self.db.commit()

            return self.get_by_id(booking_id)

        except HTTPException:
            self.db.rollback()
            raise
        except SQLAlchemyError:
            self.db.rollback()
            logger.exception("Lỗi cơ sở dữ liệu khi đặt Tour")
            raise HTTPException(
                status_code=500,
                detail="Không thể lưu đơn đặt Tour"
            )

    def update_status(self, booking_id: int, status: str):
        if status not in ("confirmed", "cancelled"):
            raise HTTPException(422, "Trạng thái không hợp lệ")

        try:
            # Khóa lịch trước để thống nhất thứ tự khóa
            booking_info = self.get_by_id(booking_id)
            self.schedule_repo.get_by_id(
                booking_info.schedule_id, lock=True
            )

            booking = self.db.get(Booking, booking_id)

            if booking.status == "cancelled":
                raise HTTPException(
                    409, "Đơn đã hủy không thể xác nhận lại"
                )

            if booking.status == status:
                return self.get_by_id(booking_id)

            booking.status = status
            self.db.commit()
            return self.get_by_id(booking_id)

        except Exception:
            self.db.rollback()
            raise