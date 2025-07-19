const request = require("supertest");
const app = require("../server"); // export app từ server.js
const mongoose = require("mongoose");
const Borrow = require("../models/borrow.model");
const { MongoMemoryServer } = require("mongodb-memory-server");
const connectDB = require("../config/db");

let mongoServer;

describe("API /api/borrows", () => {
  jest.setTimeout(15000);

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await connectDB(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  afterEach(async () => {
    await Borrow.deleteMany();
  });

  it("Thêm phiếu mượn thành công", async () => {
    const response = await request(app)
      .post("/api/borrows/add")
      .send({
        maphieu: "M01",
        madocgia: "DG01",
        masach: "S001",
        tiencoc: 50000,
        borrowDate: "2025-07-07",
        returnDate: "2025-07-14"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.borrow.maphieu).toBe("M01");
  });

  it("Không thêm nếu thiếu thông tin", async () => {
    const response = await request(app)
      .post("/api/borrows/add")
      .send({
        maphieu: "",
        madocgia: "DG01",
        masach: "S001",
        tiencoc: 50000,
        borrowDate: "2025-07-07",
        returnDate: "2025-07-14"
      });

    expect(response.statusCode).toBe(400);
  });

  it("Lấy danh sách phiếu mượn", async () => {
    await Borrow.create({
      maphieu: "M01",
      madocgia: "DG01",
      masach: "S001",
      tiencoc: 50000,
      borrowDate: "2025-07-07",
      returnDate: "2025-07-14"
    });

    const res = await request(app).get("/api/borrows");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].maphieu).toBe("M01");
  });

  it("Cập nhật phiếu mượn", async () => {
    const borrow = await Borrow.create({
      maphieu: "M02",
      madocgia: "DG02",
      masach: "S002",
      tiencoc: 60000,
      borrowDate: "2025-07-05",
      returnDate: "2025-07-10"
    });

    const res = await request(app)
      .put(`/api/borrows/${borrow._id}`)
      .send({ tiencoc: 70000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.borrow.tiencoc).toBe(70000);
  });

  it("Xoá phiếu mượn", async () => {
    const borrow = await Borrow.create({
      maphieu: "M03",
      madocgia: "DG03",
      masach: "S003",
      tiencoc: 65000,
      borrowDate: "2025-07-01",
      returnDate: "2025-07-10"
    });

    const res = await request(app).delete(`/api/borrows/${borrow._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/xoá thành công/i);
  });

  it("Thống kê trạng thái phiếu mượn", async () => {
    await Borrow.create([
      { maphieu: "M04", madocgia: "DG01", masach: "S01", tiencoc: 50000, status: "open", borrowDate: "2025-06-01", returnDate: "2025-06-10" },
      { maphieu: "M05", madocgia: "DG02", masach: "S02", tiencoc: 50000, status: "closed", borrowDate: "2025-06-01", returnDate: "2025-06-10" },
      { maphieu: "M06", madocgia: "DG03", masach: "S03", tiencoc: 50000, status: "overdue", borrowDate: "2025-06-01", returnDate: "2025-06-10" }
    ]);

    const res = await request(app).get("/api/borrows/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("open");
    expect(res.body).toHaveProperty("closed");
    expect(res.body).toHaveProperty("overdue");
  });

  it("Thống kê số lượt mượn theo tháng", async () => {
    await Borrow.create({
      maphieu: "M07",
      madocgia: "DG04",
      masach: "S04",
      tiencoc: 40000,
      borrowDate: "2025-03-15",
      returnDate: "2025-03-22"
    });

    const res = await request(app).get("/api/borrows/stats/monthly");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(12);
    expect(res.body[2]).toBeGreaterThanOrEqual(1); // tháng 3
  });
});
