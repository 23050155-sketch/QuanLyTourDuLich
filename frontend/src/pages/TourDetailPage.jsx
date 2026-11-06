import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";


import TourOverview from "../components/tour-detail/TourOverview";
import TourItinerary from "../components/tour-detail/TourItinerary";
import TourMenus from "../components/tour-detail/TourMenus";
import TourPolicies from "../components/tour-detail/TourPolicies";
import TourGallery from "../components/tour-detail/TourGallery";

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


  const [fullDetails, setFullDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState("");

  // ===== TẢI THÔNG TIN TOUR VÀ LỊCH KHỞI HÀNH =====
  useEffect(() => {
    if (!id) {
      setError("Mã Tour không hợp lệ.");
      setLoading(false);
      return;
    }

    let active = true;

    const loadTour = async () => {
      try {
        setLoading(true);
        setError("");

        const [tourResponse, schedulesResponse] =
          await Promise.all([
            axiosClient.get(`/api/tours/${id}`),
            axiosClient.get("/api/schedules"),
          ]);

        if (!active) return;

        setTour(tourResponse.data);

        // Lọc lịch khởi hành thuộc Tour đang xem
        const allSchedules = Array.isArray(schedulesResponse.data)
          ? schedulesResponse.data
          : [];

        setSchedules(
          allSchedules.filter(
            (schedule) =>
              Number(schedule.tour_id) === Number(id) &&
              schedule.status === "open"
          )
        );
      } catch (err) {
        if (!active) return;

        setError(
          err.response?.data?.detail ||
          "Không thể tải thông tin Tour."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTour();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const loadFullDetails = async () => {
      try {
        setDetailsLoading(true);
        setDetailsError("");

        const response = await axiosClient.get(
          `/api/tours/${id}/full-details`
        );

        if (active) {
          setFullDetails(response.data);
        }
      } catch (error) {
        if (active) {
          setDetailsError(
            "Không thể tải thông tin chi tiết Tour."
          );
        }
      } finally {
        if (active) {
          setDetailsLoading(false);
        }
      }
    };

    loadFullDetails();

    return () => {
      active = false;
    };
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

          {/* ===== BƯỚC 6.5.3: NỘI DUNG CHI TIẾT TOUR ===== */}
          {/* THÔNG TIN TỔNG QUAN TOUR */}
          <div className="td-content">
            {detailsLoading ? (
              <p className="td-muted">
                Đang tải thông tin chi tiết Tour...
              </p>
            ) : detailsError ? (
              <p className="td-error" role="alert">
                {detailsError}
              </p>
            ) : fullDetails ? (
              <TourOverview
                tour={tour}
                details={fullDetails.details}
              />
            ) : null}
          </div>
          {/* ===== KẾT THÚC NỘI DUNG CHI TIẾT ===== */}

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

      {/* ===== NỘI DUNG CHI TIẾT TOÀN CHIỀU RỘNG ===== */}
      {!detailsLoading && !detailsError && fullDetails && (
        <div className="td-full-sections">

          {/* Lịch trình từng ngày */}
          <TourItinerary
            itinerary={fullDetails.itinerary}
          />

          {/* Thực đơn */}
          <TourMenus
            itinerary={fullDetails.itinerary}
          />

          {/* Chính sách Tour */}
          <TourPolicies
            policies={fullDetails.policies}
          />

          {/* Hình ảnh điểm đến */}
          <TourGallery
            images={fullDetails.images}
          />

        </div>
      )}
      {/* ===== KẾT THÚC NỘI DUNG CHI TIẾT ===== */}

    </main>
  );
}

export default TourDetailPage;