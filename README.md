# 📚 Hệ Thống Quản Lý Mượn/Trả Sách - CMPM

Dự án xây dựng hệ thống quản lý mượn/trả sách với các chức năng đăng ký độc giả, mượn - trả sách, xử lý vi phạm, phân quyền người dùng và gửi thông báo qua email.

---

## 🧩 Công nghệ sử dụng

| Thành phần | Công nghệ |
|-----------|-----------|
| Backend   | Node.js, Express, MongoDB (Mongoose) |
| Frontend  | HTML tĩnh |
| Xác thực  | JWT (JSON Web Token) |
| Kiểm thử  | Jest, Supertest, MongoMemoryServer |
| CI/CD     | GitHub Actions |
| Gửi Email | Nodemailer |
| Triển khai| Docker, Docker Compose |

---

## 📁 Cấu trúc thư mục chính

```plaintext
CMPM/
├── backend/
│   └── api/
│       ├── config/          # Kết nối CSDL, Swagger cấu hình
│       ├── controllers/     # Hàm xử lý logic
│       ├── middleware/      # Middleware (auth, xử lý lỗi)
│       ├── models/          # Mongoose Schema (Sách, Độc giả, Mượn/Trả)
│       ├── routes/          # API endpoints
│       ├── tests/           # Unit test theo từng module
│       ├── utils/           # Gửi email, tiện ích chung
│       ├── seed.js          # Dữ liệu mẫu ban đầu
│       ├── server.js        # Khởi động server
├── frontend/
│   ├── pages/               # HTML giao diện người dùng
│   └── image/               # Hình ảnh tĩnh
├── .env                     # Biến môi trường
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Build Docker image
├── README.md               # Tài liệu dự án

