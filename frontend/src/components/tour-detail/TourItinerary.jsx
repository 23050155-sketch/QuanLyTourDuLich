import { useState } from "react";
import {
  Clock3,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const periodLabels = {
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
  evening: "Buổi tối",
};

const formatTime = (value) => {
  if (!value) return "";
  return String(value).slice(0, 5);
};

function TourItinerary({ itinerary = [] }) {
  const [openDays, setOpenDays] = useState([0]);

  const toggleDay = (index) => {
    setOpenDays((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  };

  return (
    <section className="td-section" id="tour-itinerary">
      <h2>Lịch trình chi tiết Tour</h2>

      {itinerary.length === 0 ? (
        <p className="td-muted">
          Lịch trình chi tiết đang được cập nhật.
        </p>
      ) : (
        <div className="td-itinerary-list">
          {itinerary.map((day, index) => {
            const isOpen = openDays.includes(index);

            const activities = [...(day.activities || [])].sort(
              (a, b) =>
                a.sort_order - b.sort_order ||
                String(a.start_time || "").localeCompare(
                  String(b.start_time || "")
                )
            );

            return (
              <article className="td-day" key={day.id}>
                <button
                  type="button"
                  className="td-day-header"
                  onClick={() => toggleDay(index)}
                  aria-expanded={isOpen}
                >
                  <span>
                    Ngày {day.day_number}: {day.title}
                  </span>

                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>

                {isOpen && (
                  <div className="td-day-content">
                    {day.overview && (
                      <p className="td-day-overview">
                        {day.overview}
                      </p>
                    )}

                    {activities.length === 0 ? (
                      <p className="td-muted">
                        Hoạt động đang được cập nhật.
                      </p>
                    ) : (
                      <div className="td-activity-list">
                        {activities.map((activity) => (
                          <div
                            className="td-activity"
                            key={activity.id}
                          >
                            <div className="td-activity-time">
                              <Clock3 size={16} />
                              {formatTime(activity.start_time) ||
                                periodLabels[activity.period] ||
                                "Theo lịch trình"}
                            </div>

                            <div className="td-activity-body">
                              <h3>{activity.title}</h3>

                              {activity.location && (
                                <p className="td-activity-location">
                                  <MapPin size={15} />
                                  {activity.location}
                                </p>
                              )}

                              {activity.description && (
                                <p>{activity.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TourItinerary;