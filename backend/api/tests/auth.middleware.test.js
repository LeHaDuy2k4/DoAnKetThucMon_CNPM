const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

const SECRET_KEY = process.env.SECRET_KEY || "test_secret"; // fallback

// Tạo app test đơn giản
const app = express();
app.use(express.json());

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Đã xác thực", user: req.user });
});

app.get("/admin", verifyToken, requireRole("admin"), (req, res) => {
  res.json({ message: "Đã vào trang admin" });
});

describe("Middleware: verifyToken", () => {
  const tokenUser = jwt.sign({ username: "user1", role: "user" }, SECRET_KEY);
  const tokenAdmin = jwt.sign({ username: "admin1", role: "admin" }, SECRET_KEY);

  it("Từ chối nếu không có token", async () => {
    const res = await request(app).get("/protected");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/không có token/i);
  });

  it("Từ chối nếu token không hợp lệ", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer abcxyz");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/token không hợp lệ/i);
  });

  it("Cho phép nếu token hợp lệ", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("user1");
  });
});

describe("Middleware: requireRole", () => {
  const tokenUser = jwt.sign({ username: "user1", role: "user" }, SECRET_KEY);
  const tokenAdmin = jwt.sign({ username: "admin1", role: "admin" }, SECRET_KEY);

  it("Từ chối nếu không đủ quyền", async () => {
    const res = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/không có quyền/i);
  });

  it("Cho phép nếu có đúng quyền", async () => {
    const res = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/trang admin/i);
  });
});
