const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Category = require("../models/category.model");
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
  await Category.deleteMany();
});

describe("API /api/categories", () => {
  const sampleCategory = {
    maTheLoai: "TL01",
    tenTheLoai: "Khoa học"
  };

  it("Thêm thể loại thành công", async () => {
    const res = await request(app).post("/api/categories/add").send(sampleCategory);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Category.findOne({ maTheLoai: "TL01" });
    expect(found).not.toBeNull();
    expect(found.tenTheLoai).toBe("Khoa học");
  });

  it("Không thêm nếu thiếu trường bắt buộc", async () => {
    const res = await request(app).post("/api/categories/add").send({
      maTheLoai: "TL02"
      // thiếu tenTheLoai
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/tenTheLoai/);
  });

  it("Lấy danh sách thể loại", async () => {
    await Category.create(sampleCategory);
    const res = await request(app).get("/api/categories");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].maTheLoai).toBe("TL01");
  });

  it("Cập nhật thể loại thành công", async () => {
    await Category.create(sampleCategory);

    const res = await request(app)
      .put("/api/categories/TL01")
      .send({ tenTheLoai: "Văn học" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.category.tenTheLoai).toBe("Văn học");
  });

  it("Xoá thể loại thành công", async () => {
    await Category.create(sampleCategory);

    const res = await request(app).delete("/api/categories/TL01");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Category.findOne({ maTheLoai: "TL01" });
    expect(found).toBeNull();
  });

  it("Không xoá được nếu mã thể loại không tồn tại", async () => {
    const res = await request(app).delete("/api/categories/UNKNOWN");

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/không tìm thấy/i);
  });
});
