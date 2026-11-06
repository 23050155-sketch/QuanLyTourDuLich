USE quan_ly_tour;

-- 1. THÔNG TIN CHI TIẾT TOUR
CREATE TABLE IF NOT EXISTS tour_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL UNIQUE,

    duration_text VARCHAR(100),
    route VARCHAR(500),
    transportation VARCHAR(255),
    hotel_info VARCHAR(500),
    gifts TEXT,

    departure_location VARCHAR(500),
    notes TEXT,

    CONSTRAINT fk_tour_details_tour
        FOREIGN KEY (tour_id)
        REFERENCES tours(id)
        ON DELETE CASCADE
);

-- 2. LỊCH TRÌNH THEO NGÀY
CREATE TABLE IF NOT EXISTS tour_itinerary_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,

    day_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    overview TEXT,

    CONSTRAINT fk_itinerary_days_tour
        FOREIGN KEY (tour_id)
        REFERENCES tours(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_itinerary_day_number
        CHECK (day_number > 0),

    UNIQUE (tour_id, day_number)
);

-- 3. HOẠT ĐỘNG TRONG TỪNG NGÀY
CREATE TABLE IF NOT EXISTS tour_itinerary_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_day_id INT NOT NULL,

    start_time TIME,
    period ENUM(
        'morning',
        'afternoon',
        'evening'
    ),

    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    activity_type ENUM(
        'departure',
        'transport',
        'visit',
        'meal',
        'rest',
        'hotel',
        'other'
    ) DEFAULT 'other',

    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_activities_day
        FOREIGN KEY (itinerary_day_id)
        REFERENCES tour_itinerary_days(id)
        ON DELETE CASCADE
);

-- 4. THỰC ĐƠN
CREATE TABLE IF NOT EXISTS tour_menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_day_id INT NOT NULL,

    meal_type ENUM(
        'breakfast',
        'lunch',
        'dinner'
    ) NOT NULL,

    restaurant_name VARCHAR(255),
    menu_description TEXT,
    included BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_menus_day
        FOREIGN KEY (itinerary_day_id)
        REFERENCES tour_itinerary_days(id)
        ON DELETE CASCADE,

    UNIQUE (itinerary_day_id, meal_type)
);

-- 5. CHÍNH SÁCH TOUR
CREATE TABLE IF NOT EXISTS tour_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL UNIQUE,

    children_policy TEXT,
    price_includes TEXT,
    price_excludes TEXT,
    cancellation_policy TEXT,
    payment_policy TEXT,
    additional_notes TEXT,

    CONSTRAINT fk_policies_tour
        FOREIGN KEY (tour_id)
        REFERENCES tours(id)
        ON DELETE CASCADE
);

-- 6. HÌNH ẢNH TOUR
CREATE TABLE IF NOT EXISTS tour_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,

    image_url VARCHAR(1000) NOT NULL,
    caption VARCHAR(255),
    alt_text VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_images_tour
        FOREIGN KEY (tour_id)
        REFERENCES tours(id)
        ON DELETE CASCADE
);