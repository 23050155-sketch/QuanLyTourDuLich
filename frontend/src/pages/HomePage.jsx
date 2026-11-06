import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";

function HomePage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTours = async () => {
      try {
        const response = await axiosClient.get("/api/tours");
        setTours(response.data);
      } catch (err) {
        console.error("Lỗi tải Tour:", err);
        setError("Không thể tải danh sách Tour từ hệ thống.");
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>DU LỊCH VIỆT NAM</h1>
        <p>Khám phá những hành trình tuyệt vời trên khắp Việt Nam</p>
      </header>

      <main>
        <div className="section-heading">
          <h2>Danh sách Tour du lịch</h2>
          <p>Khám phá các Tour đang có trong hệ thống</p>
        </div>

        {loading && <p>Đang tải danh sách Tour...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && tours.length === 0 && (
          <p>Hiện chưa có Tour nào trong hệ thống.</p>
        )}

        <div className="tour-grid">
          {tours.map((tour) => (
            <div className="tour-card" key={tour.id}>
              {tour.image_url ? (
                <img src={tour.image_url} alt={tour.name} />
              ) : (
                <div className="tour-placeholder">
                  <span>DU LỊCH VIỆT NAM</span>
                </div>
              )}

              <div className="tour-content">
                <h3>{tour.name}</h3>

                <p className="tour-description">
                  {tour.description || "Khám phá hành trình thú vị."}
                </p>

                <p>
                  <strong>Thời gian:</strong> {tour.duration_days} ngày
                </p>

                <p className="tour-price">
                  {Number(tour.price).toLocaleString("vi-VN")} VNĐ
                </p>

                <Link
                  to={`/tours/${tour.id}`}
                  className="btn-detail"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default HomePage;