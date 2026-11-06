import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";

const STATUS = {
  pending: { label: "Chờ xác nhận", className: "pending" },
  confirmed: { label: "Đã xác nhận", className: "confirmed" },
  cancelled: { label: "Đã hủy", className: "cancelled" },
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN") + " VNĐ";

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("vi-VN");
};

function MyBookingsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get("/api/bookings/my");

        if (active) {
          setBookings(
            Array.isArray(response.data) ? response.data : []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.detail ||
              "Không thể tải lịch sử đặt Tour."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBookings();

    return () => {
      active = false;
    };
  }, [user, authLoading, navigate]);

  const handleViewDetail = async (bookingId) => {
    try {
      setDetailLoading(true);
      setError("");

      const response = await axiosClient.get(
        `/api/bookings/${bookingId}`
      );

      setSelectedBooking(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Không thể tải chi tiết đơn đặt Tour."
      );
    } finally {
      setDetailLoading(false);
    }
  };


  const handleCancelBooking = async (booking) => {
    if (booking.status !== "pending") {
        setError("Chỉ có thể hủy đơn đang chờ xác nhận.");
        return;
    }

    const confirmed = window.confirm(
        `Bạn có chắc chắn muốn hủy đơn đặt Tour #${booking.id}?`
    );

    if (!confirmed) return;

    try {
        setCancellingId(booking.id);
        setError("");
        setSuccess("");

        await axiosClient.patch(
        `/api/bookings/${booking.id}/cancel`
        );

        setBookings((previous) =>
        previous.map((item) =>
            item.id === booking.id
            ? { ...item, status: "cancelled" }
            : item
        )
        );

        setSelectedBooking((previous) =>
        previous?.id === booking.id
            ? { ...previous, status: "cancelled" }
            : previous
        );

        setSuccess(`Đã hủy đơn #${booking.id} thành công.`);
    } catch (err) {
        const detail = err.response?.data?.detail;

        setError(
        typeof detail === "string"
            ? detail
            : "Không thể hủy đơn. Vui lòng thử lại."
        );
    } finally {
        setCancellingId(null);
    }
    };


  if (authLoading || loading) {
    return (
      <main className="my-bookings-page">
        <p>Đang tải danh sách đơn đặt Tour...</p>
      </main>
    );
  }

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  return (
    <main className="my-bookings-page">
      <div className="my-bookings-heading">
        <h1>Đơn đặt Tour của tôi</h1>
        <p>Theo dõi và quản lý những hành trình đã đặt</p>
      </div>

      <div className="booking-stats">
        <div>
          <strong>{bookings.length}</strong>
          <span>Tổng đơn</span>
        </div>

        <div>
          <strong>{pendingCount}</strong>
          <span>Chờ xác nhận</span>
        </div>

        <div>
          <strong>{confirmedCount}</strong>
          <span>Đã xác nhận</span>
        </div>
      </div>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="booking-success" role="status">
            {success}
        </p>
      )}

      {bookings.length === 0 && !error ? (
        <div className="bookings-empty">
          <h2>Bạn chưa đặt Tour nào</h2>
          <p>Hãy khám phá những hành trình hấp dẫn.</p>
          <Link to="/" className="bookings-primary-link">
            Khám phá Tour
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const status =
              STATUS[booking.status] || {
                label: booking.status || "Không xác định",
                className: "unknown",
              };

            return (
              <article className="booking-history-card" key={booking.id}>
                <div className="booking-history-top">
                  <div>
                    <h3>Đơn đặt Tour #{booking.id}</h3>
                    <span>
                      Ngày đặt: {formatDate(booking.booking_date)}
                    </span>
                  </div>

                  <span
                    className={`booking-status ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="booking-history-info">
                  <div>
                    <span>Mã lịch khởi hành</span>
                    <strong>#{booking.schedule_id}</strong>
                  </div>

                  <div>
                    <span>Số hành khách</span>
                    <strong>{booking.quantity} người</strong>
                  </div>

                  <div>
                    <span>Tổng tiền</span>
                    <strong className="booking-history-price">
                      {formatMoney(booking.total_price)}
                    </strong>
                  </div>
                </div>

                <div className="booking-history-actions">
                    <button
                        onClick={() => handleViewDetail(booking.id)}
                        disabled={detailLoading}
                    >
                        Xem chi tiết
                    </button>

                    {booking.status === "pending" && (
                        <button
                        className="cancel-booking-btn"
                        onClick={() => handleCancelBooking(booking)}
                        disabled={cancellingId === booking.id}
                        >
                        {cancellingId === booking.id
                            ? "Đang hủy..."
                            : "Hủy đơn"}
                        </button>
                    )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <div
          className="booking-modal-overlay"
          onClick={() => setSelectedBooking(null)}
        >
          <section
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Chi tiết đơn đặt Tour"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="booking-modal-heading">
              <h2>Chi tiết đơn #{selectedBooking.id}</h2>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <p>
              <strong>Trạng thái:</strong>{" "}
              {STATUS[selectedBooking.status]?.label ||
                selectedBooking.status}
            </p>

            <p>
              <strong>Mã lịch khởi hành:</strong>{" "}
              #{selectedBooking.schedule_id}
            </p>

            <p>
              <strong>Ngày đặt:</strong>{" "}
              {formatDate(selectedBooking.booking_date)}
            </p>

            <p>
              <strong>Số người:</strong>{" "}
              {selectedBooking.quantity}
            </p>

            <p>
              <strong>Tổng tiền:</strong>{" "}
              {formatMoney(selectedBooking.total_price)}
            </p>

            {Array.isArray(selectedBooking.participants) &&
              selectedBooking.participants.length > 0 && (
                <>
                  <h3>Danh sách hành khách</h3>

                  <div className="booking-participant-list">
                    {selectedBooking.participants.map((person, index) => (
                      <div key={person.id ?? index}>
                        <strong>
                          {index + 1}. {person.full_name}
                        </strong>
                        <span>{person.phone || "Không có SĐT"}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </section>
        </div>
      )}
    </main>
  );
}

export default MyBookingsPage;