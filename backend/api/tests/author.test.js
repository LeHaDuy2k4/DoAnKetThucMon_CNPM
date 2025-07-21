const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Author = require("../models/author.model");
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
  await Author.deleteMany();
});

describe("API /api/authors", () => {
  const sampleAuthor = {
    matg: "TG01",
    tentg: "Nguyễn Nhật Ánh",
    namsinh: "1955",
    quequan: "Quảng Nam"
  };

  it("Thêm tác giả thành công", async () => {
    const res = await request(app).post("/api/authors/add").send(sampleAuthor);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Author.findOne({ matg: "TG01" });
    expect(found).not.toBeNull();
    expect(found.tentg).toBe("Nguyễn Nhật Ánh");
  });

  it("Không thêm nếu thiếu trường bắt buộc", async () => {
    const res = await request(app).post("/api/authors/add").send({
      matg: "TG02", // thiếu tentg
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/tentg/);
  });

  it("Lấy danh sách tác giả", async () => {
    await Author.create(sampleAuthor);
    const res = await request(app).get("/api/authors");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].tentg).toBe("Nguyễn Nhật Ánh");
  });

  it("Cập nhật thông tin tác giả", async () => {
    await Author.create(sampleAuthor);

    const res = await request(app)
      .put("/api/authors/TG01")
      .send({ tentg: "Tác giả cập nhật", quequan: "TP.HCM" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.author.tentg).toBe("Tác giả cập nhật");
  });

  it("Xoá tác giả theo mã", async () => {
    await Author.create(sampleAuthor);

    const res = await request(app).delete("/api/authors/TG01");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Author.findOne({ matg: "TG01" });
    expect(found).toBeNull();
  });

  it("Xoá tác giả không tồn tại trả về 404", async () => {
    const res = await request(app).delete("/api/authors/INVALID");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/không tìm thấy/i);
  });
});
