const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Reader = require("../models/reader.model");
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
  await Reader.deleteMany();
});

describe("API /api/readers", () => {
  const sampleReader = {
    madocgia: "DG01",
    hoten: "Nguyễn Văn A",
    ngaysinh: "2000-01-01",
    gioitinh: "Nam",
    diachi: "Hà Nội",
    sdt: "0123456789",
    email: "a@example.com"
  };

  it("Thêm độc giả thành công", async () => {
    const res = await request(app).post("/api/readers/add").send(sampleReader);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Reader.findOne({ madocgia: "DG01" });
    expect(found).not.toBeNull();
    expect(found.hoten).toBe("Nguyễn Văn A");
  });

  it("Không thêm nếu thiếu trường bắt buộc", async () => {
    const res = await request(app).post("/api/readers/add").send({
      madocgia: "DG02", // thiếu hoten, sdt, email
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/hoten/);
  });

  it("Lấy danh sách độc giả", async () => {
    await Reader.create(sampleReader);
    const res = await request(app).get("/api/readers");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].madocgia).toBe("DG01");
  });

  it("Cập nhật thông tin độc giả", async () => {
    await Reader.create(sampleReader);

    const res = await request(app)
      .put("/api/readers/DG01")
      .send({ hoten: "Nguyễn Văn B" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reader.hoten).toBe("Nguyễn Văn B");
  });

  it("Xoá độc giả", async () => {
    await Reader.create(sampleReader);

    const res = await request(app).delete("/api/readers/DG01");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Reader.findOne({ madocgia: "DG01" });
    expect(found).toBeNull();
  });

  it("Không xoá được nếu không tồn tại", async () => {
    const res = await request(app).delete("/api/readers/XX99");

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/không tìm thấy/i);
  });
});
