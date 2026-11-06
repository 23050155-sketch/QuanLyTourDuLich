# HỆ THỐNG QUẢN LÝ TOUR DU LỊCH NỘI ĐỊA (HTTT16)

## 1. Giới thiệu

Dự án xây dựng website quản lý và đặt tour du lịch nội địa, hỗ trợ khách hàng tìm kiếm tour, đặt tour và theo dõi lịch trình. Hệ thống cung cấp các chức năng quản trị tour, hướng dẫn viên, đơn đặt tour, phản hồi khách hàng và báo cáo doanh thu.

## 2. Công nghệ sử dụng

- **Backend:** Python, FastAPI
- **Frontend:** ReactJS, Vite (dự kiến triển khai)
- **Database:** MySQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT (dự kiến triển khai)
- **Design Pattern:** Repository Pattern, Service Layer Pattern
- **API:** RESTful API

## 3. Các chức năng chính

**Khách hàng:** Đăng ký, đăng nhập, tìm kiếm tour, xem chi tiết, đặt tour, xem lịch sử và đánh giá.

**Nhân viên:** Quản lý đơn đặt tour, danh sách người tham gia và lịch phân công.

**Quản trị viên:** Quản lý tour, lịch khởi hành, tài khoản, hướng dẫn viên, phản hồi và báo cáo doanh thu.

## 4. Cấu trúc dự án

```text
QuanLyTourDuLich/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── core/
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
├── database/
│   └── schema.sql
├── docs/
│   └── uml/
└── README.md
```

## 5. Tiến độ thực hiện

### Bước 1 – Thiết kế hệ thống
- [x] Xác định các chức năng chính
- [x] Thiết kế cơ sở dữ liệu MySQL gồm 9 bảng
- [x] Khởi tạo cấu trúc thư mục dự án

### Bước 2 – Backend FastAPI
- [x] Khởi tạo môi trường Python
- [x] Cài đặt các thư viện Backend
- [x] Xây dựng API kiểm tra hoạt động
- [ ] Xác nhận kết nối MySQL thành công

### Bước 3 – Xây dựng nghiệp vụ
- [ ] Tạo SQLAlchemy Models
- [ ] Xây dựng Repository Pattern
- [ ] Xây dựng Service Layer
- [ ] Hoàn thiện API quản lý tour

### Bước 4 – Xác thực và Frontend
- [ ] Xây dựng đăng ký, đăng nhập JWT
- [ ] Xây dựng giao diện ReactJS
- [ ] Kết nối Frontend với Backend

### Bước 5 – Hoàn thiện
- [ ] Hoàn thiện sơ đồ UML
- [ ] Kiểm thử hệ thống
- [ ] Báo cáo và demo

## 6. Hướng dẫn chạy Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Tạo file `.env` từ `.env.example`, sau đó cập nhật mật khẩu MySQL trên máy.

Chạy ứng dụng:

```powershell
python -m uvicorn app.main:app --reload
```

Truy cập tài liệu API tại:

http://127.0.0.1:8000/docs

## 7. Ghi chú

Dự án đang trong quá trình phát triển. Các chức năng nghiệp vụ, JWT và giao diện ReactJS sẽ được bổ sung ở các giai đoạn tiếp theo.