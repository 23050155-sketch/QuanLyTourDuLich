import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";

function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tour, setTour] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [scheduleId, setScheduleId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [participants, setParticipants] = useState([
    { full_name: "", phone: "" },
  ]);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [tourResponse, scheduleResponse] =
          await Promise.all([
            axiosClient.get(`/api/tours/${id}`),
            axiosClient.get("/api/schedules"),
          ]);

        setTour(tourResponse.data);

        const availableSchedules = scheduleResponse.data.filter(
          (schedule) =>
            Number(schedule.tour_id) === Number(id) &&
            schedule.status === "open" &&
            new Date(`${schedule.departure_date}T00:00:00`) >=
              new Date(new Date().toDateString())
        );

        setSchedules(availableSchedules);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin Tour.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleQuantityChange = (value) => {
    const number = Number(value);

    if (!Number.isInteger(number) || number < 1) {
      return;
    }

    setQuantity(number);

    setParticipants((previous) =>
      Array.from(
        { length: number },
        (_, index) =>
          previous[index] || { full_name: "", phone: "" }
      )
    );
  };

  const handleParticipantChange = (index, field, value) => {
    setParticipants((previous) =>
      previous.map((person, i) =>
        i === index
          ? { ...person, [field]: value }
          : person
      )
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!scheduleId) {
      setError("Vui lòng chọn lịch khởi hành.");
      return;
    }

    const selectedSchedule = schedules.find(
      (schedule) => String(schedule.id) === scheduleId
    );

    if (!selectedSchedule) {
      setError("Lịch khởi hành không hợp lệ.");
      return;
    }

    if (quantity > Number(selectedSchedule.capacity)) {
      setError("Số người vượt quá sức chứa của lịch khởi hành.");
      return;
    }

    if (
      participants.some(
        (person) =>
          !person.full_name.trim() || !person.phone.trim()
      )
    ) {
      setError("Vui lòng nhập đầy đủ thông tin hành khách.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setMessage("");

      await axiosClient.post("/api/bookings", {
        schedule_id: Number(scheduleId),
        quantity,
        participants: participants.map((person) => ({
          full_name: person.full_name.trim(),
          phone: person.phone.trim(),
        })),
      });

      setMessage("Đặt Tour thành công! Đơn hàng đang chờ xác nhận.");
    } catch (err) {
      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Đặt Tour thất bại. Vui lòng thử lại."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <main className="tour-detail-container">Đang tải Tour...</main>;
  }

  if (!tour) {
    return (
      <main className="tour-detail-container">
        <p className="auth-error">{error || "Không tìm thấy Tour."}</p>
      </main>
    );
  }

  const totalPrice = Number(tour.price) * quantity;

  return (
    <main className="tour-detail-container">
      <button
        className="back-link"
        onClick={() => navigate("/")}
      >
        ← Quay lại danh sách Tour
      </button>

      <h1>{tour.name}</h1>

      <div className="tour-detail-grid">
        <section className="tour-information">
          {tour.image_url ? (
            <img
              className="tour-detail-image"
              src={tour.image_url}
              alt={tour.name}
            />
          ) : (
            <div className="tour-detail-placeholder">
              DU LỊCH VIỆT NAM
            </div>
          )}

          <h2>Thông tin Tour</h2>

          <p>
            <strong>Thời gian:</strong> {tour.duration_days} ngày
          </p>

          <p>
            <strong>Mùa du lịch:</strong> {tour.season || "Quanh năm"}
          </p>

          <h3>Giới thiệu</h3>
          <p className="tour-detail-description">
            {tour.description || "Đang cập nhật mô tả."}
          </p>
        </section>

        <aside className="booking-panel">
          <h2>Đặt Tour ngay</h2>

          <p className="booking-price">
            {Number(tour.price).toLocaleString("vi-VN")} VNĐ
            <span> / người</span>
          </p>

          <form onSubmit={handleBooking}>
            <label>Lịch khởi hành</label>

            <select
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
              required
            >
              <option value="">-- Chọn lịch khởi hành --</option>

              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.departure_date} – {schedule.return_date}
                  {" "}({schedule.capacity} chỗ)
                </option>
              ))}
            </select>

            {schedules.length === 0 && (
              <p className="booking-note">
                Tour chưa có lịch khởi hành đang mở.
              </p>
            )}

            <label>Số lượng người tham gia</label>

            <input
              type="number"
              min="1"
              max={
                schedules.find(
                  (s) => String(s.id) === scheduleId
                )?.capacity || undefined
              }
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(e.target.value)
              }
              required
            />

            <h3>Thông tin hành khách</h3>

            {participants.map((person, index) => (
              <div className="participant-form" key={index}>
                <h4>Hành khách {index + 1}</h4>

                <input
                  placeholder="Họ và tên"
                  value={person.full_name}
                  onChange={(e) =>
                    handleParticipantChange(
                      index,
                      "full_name",
                      e.target.value
                    )
                  }
                  required
                />

                <input
                  placeholder="Số điện thoại"
                  type="tel"
                  value={person.phone}
                  onChange={(e) =>
                    handleParticipantChange(
                      index,
                      "phone",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            ))}

            <div className="booking-total">
              <span>Tổng tiền:</span>
              <strong>
                {totalPrice.toLocaleString("vi-VN")} VNĐ
              </strong>
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="booking-success" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="booking-submit"
              disabled={booking || schedules.length === 0}
            >
              {booking
                ? "Đang xử lý..."
                : user
                  ? "Xác nhận đặt Tour"
                  : "Đăng nhập để đặt Tour"}
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}

export default TourDetailPage;