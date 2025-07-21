const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Publisher = require("../models/publisher.model");
const connectDB = require("../config/db");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Publisher.deleteMany();
});

describe("API /api/publishers", () => {
  const samplePublisher = {
    manxb: "NXB001",
    tennxb: "NXB Kim Đồng",
    diachi: "Hà Nội",
    sdt: "0123456789"
  };

  it("Thêm nhà xuất bản thành công", async () => {
    const res = await request(app).post("/api/publishers/add").send(samplePublisher);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Publisher.findOne({ manxb: "NXB001" });
    expect(found).not.toBeNull();
    expect(found.tennxb).toBe("NXB Kim Đồng");
  });

  it("Lấy danh sách nhà xuất bản", async () => {
    await Publisher.create(samplePublisher);

    const res = await request(app).get("/api/publishers");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].manxb).toBe("NXB001");
  });

  it("Cập nhật nhà xuất bản thành công", async () => {
    await Publisher.create(samplePublisher);

    const res = await request(app)
      .put("/api/publishers/NXB001")
      .send({ tennxb: "NXB Trẻ" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.publisher.tennxb).toBe("NXB Trẻ");
  });

  it("Không cập nhật nếu không tìm thấy nhà xuất bản", async () => {
    const res = await request(app)
      .put("/api/publishers/UNKNOWN")
      .send({ tennxb: "NXB Mới" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Không tìm thấy/);
  });

  it("Xoá nhà xuất bản thành công", async () => {
    await Publisher.create(samplePublisher);

    const res = await request(app).delete("/api/publishers/NXB001");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Publisher.findOne({ manxb: "NXB001" });
    expect(found).toBeNull();
  });

  it("Không xoá nếu không tìm thấy nhà xuất bản", async () => {
    const res = await request(app).delete("/api/publishers/UNKNOWN");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Không tìm thấy/);
  });
});
