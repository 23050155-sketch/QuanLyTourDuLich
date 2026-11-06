from decimal import Decimal

from sqlalchemy import (
    Integer, String, Text, ForeignKey,
    DECIMAL, Enum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Tour(Base):
    __tablename__ = "tours"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    destination_id: Mapped[int] = mapped_column(
        ForeignKey("destinations.id"),
        nullable=False
    )

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    price: Mapped[Decimal] = mapped_column(
        DECIMAL(12, 2),
        nullable=False
    )

    duration_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    season: Mapped[str | None] = mapped_column(String(50))
    image_url: Mapped[str | None] = mapped_column(String(500))

    status: Mapped[str] = mapped_column(
        Enum("active", "inactive"),
        default="active",
        nullable=False
    )

    destination = relationship(
        "Destination",
        back_populates="tours"
    )