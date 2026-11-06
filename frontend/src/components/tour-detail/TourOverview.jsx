import {
  Clock3,
  MapPinned,
  BusFront,
  Hotel,
  Gift,
  MapPin,
} from "lucide-react";

function TourOverview({ tour, details }) {
  const items = [
    {
      icon: Clock3,
      label: "Thời gian",
      value: details?.duration_text || `${tour.duration_days} ngày`,
    },
    {
      icon: MapPinned,
      label: "Lịch trình",
      value: details?.route,
    },
    {
      icon: BusFront,
      label: "Phương tiện",
      value: details?.transportation,
    },
    {
      icon: Hotel,
      label: "Khách sạn",
      value: details?.hotel_info,
    },
    {
      icon: Gift,
      label: "Quà tặng",
      value: details?.gifts,
    },
    {
      icon: MapPin,
      label: "Điểm tập trung",
      value: details?.departure_location,
    },
  ];

  return (
    <section className="td-section">
      <h2>Thông tin chương trình Tour</h2>

      <div className="td-overview-grid">
        {items.map(({ icon: Icon, label, value }) => (
          <div className="td-overview-item" key={label}>
            <Icon size={23} className="td-overview-icon" />

            <div>
              <span>{label}</span>
              <strong>{value || "Đang cập nhật"}</strong>
            </div>
          </div>
        ))}
      </div>

      {details?.notes && (
        <div className="td-note">
          <strong>Lưu ý:</strong> {details.notes}
        </div>
      )}
    </section>
  );
}

export default TourOverview;