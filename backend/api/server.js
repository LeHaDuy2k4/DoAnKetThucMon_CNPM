require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const { seedInitialBooks } = require("./models/book.model");
const pkg = require("./package.json");

const publisherRoutes = require("./routes/publisher.routes");
const accountRoutes = require("./routes/account.routes");
const authRoutes = require("./routes/auth.routes");
const notificationRoutes = require("./routes/notification.route");
const authorRoutes = require("./routes/author.routes");
const categoryRoutes = require("./routes/category.routes");
const readerRoutes = require("./routes/reader.routes");
const bookRoutes = require("./routes/book.route");
const employeeRoutes = require("./routes/employee.routes");
const borrowRoutes = require("./routes/borrow.routes");
const returnRoutes = require("./routes/return.routes");
const fineRoutes = require("./routes/fine.routes");

const { swaggerSpec, swaggerUi } = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Kết nối MongoDB và khởi tạo dữ liệu mẫu
connectDB().then(() => {
  seedInitialBooks();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Swagger + API Info
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api", (req, res) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description || "Backend API",
    author: pkg.author || "Author",
  });
});

// ✅ API Routes
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/readers", readerRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/fines", fineRoutes);


// ✅ Xử lý lỗi 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// ✅ Xử lý lỗi server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Chỉ khởi động server khi KHÔNG phải đang test
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`📄 Swagger at http://localhost:${PORT}/api-docs`);
  });
}

// ✅ Export cho supertest dùng trong test
module.exports = app;
