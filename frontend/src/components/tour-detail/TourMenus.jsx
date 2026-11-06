import { UtensilsCrossed } from "lucide-react";

const mealLabels = {
  breakfast: "Bữa sáng",
  lunch: "Bữa trưa",
  dinner: "Bữa tối",
};

const mealOrder = {
  breakfast: 1,
  lunch: 2,
  dinner: 3,
};

function TourMenus({ itinerary = [] }) {
  const daysWithMenus = itinerary.filter(
    (day) => day.menus?.length > 0
  );

  if (daysWithMenus.length === 0) return null;

  return (
    <section className="td-section" id="tour-menus">
      <h2>
        <UtensilsCrossed size={23} />
        Thực đơn trong chương trình
      </h2>

      {daysWithMenus.map((day) => (
        <div className="td-menu-day" key={day.id}>
          <h3>Ngày {day.day_number}: {day.title}</h3>

          <div className="td-menu-grid">
            {[...day.menus]
              .sort(
                (a, b) =>
                  mealOrder[a.meal_type] -
                  mealOrder[b.meal_type]
              )
              .map((menu) => (
                <div className="td-menu-card" key={menu.id}>
                  <strong>
                    {mealLabels[menu.meal_type] ||
                      menu.meal_type}
                  </strong>

                  <span
                    className={
                      menu.included
                        ? "td-meal-included"
                        : "td-meal-excluded"
                    }
                  >
                    {menu.included
                      ? "Đã bao gồm"
                      : "Chi phí tự túc"}
                  </span>

                  {menu.restaurant_name && (
                    <p>
                      <b>Nhà hàng:</b> {menu.restaurant_name}
                    </p>
                  )}

                  {menu.menu_description && (
                    <p>{menu.menu_description}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default TourMenus;