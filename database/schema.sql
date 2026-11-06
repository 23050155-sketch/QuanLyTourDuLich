CREATE DATABASE IF NOT EXISTS quan_ly_tour
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE quan_ly_tour;


# Bảng tài khoản người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin','staff','customer')
        NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


# Bảng địa điểm
CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    province VARCHAR(100) NOT NULL,
    description TEXT
);


# Bảng tour
CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    duration_days INT NOT NULL,
    season VARCHAR(50),
    image_url VARCHAR(500),
    status ENUM('active','inactive')
        DEFAULT 'active',
    FOREIGN KEY (destination_id)
        REFERENCES destinations(id),
    CHECK (price >= 0),
    CHECK (duration_days > 0)
);


# Bảng lịch khởi hành
CREATE TABLE tour_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    capacity INT NOT NULL,
    status ENUM('open','closed','cancelled')
        DEFAULT 'open',
    FOREIGN KEY (tour_id) REFERENCES tours(id),
    CHECK (capacity > 0),
    CHECK (return_date >= departure_date)
);


# Bảng đặt tour
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    schedule_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    status ENUM(
        'pending','confirmed','cancelled'
    ) DEFAULT 'pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules(id),
    CHECK (quantity > 0),
    CHECK (total_price >= 0)
);


# Bảng người tham gia
CREATE TABLE booking_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);


# Bảng hướng dẫn viên
CREATE TABLE tour_guides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    status ENUM('active','inactive')
        DEFAULT 'active'
);


# Bảng phân công hướng dẫn viên
CREATE TABLE guide_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guide_id INT NOT NULL,
    schedule_id INT NOT NULL,
    UNIQUE (guide_id, schedule_id),
    FOREIGN KEY (guide_id)
        REFERENCES tour_guides(id),
    FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules(id)
);


# Bảng đánh giá
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tour_id) REFERENCES tours(id),
    CHECK (rating BETWEEN 1 AND 5)
);


