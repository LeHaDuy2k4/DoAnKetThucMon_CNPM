const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const { Book } = require("../models/book.model");
const connectDB = require("../config/db");

let mongoServer;

describe("API /api/books", () => {
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
    await Book.deleteMany();
  });

  const sampleBook = {
    id: "S001",
    title: "Test Book",
    author: "Author A",
    year: 2023,
    genre: "Science",
    status: "Available",
    email: "reader@example.com"
  };

  it("Thêm sách thành công", async () => {
    const res = await request(app).post("/api/books").send(sampleBook);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const found = await Book.findOne({ id: "S001" });
    expect(found.title).toBe("Test Book");
  });

  it("Không thêm nếu thiếu trường bắt buộc", async () => {
    const res = await request(app).post("/api/books").send({
      id: "S002",
      author: "Author B",
      year: 2022,
      genre: "Fiction"
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title/);
  });

  it("Lấy danh sách tất cả sách", async () => {
    await Book.create(sampleBook);
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe("S001");
  });

  it("Lấy sách theo ID", async () => {
    await Book.create(sampleBook);
    const res = await request(app).get("/api/books/S001");
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test Book");
  });

  it("Cập nhật sách theo ID", async () => {
    await Book.create(sampleBook);
    const res = await request(app)
      .put("/api/books/S001")
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(200);
    const updated = await Book.findOne({ id: "S001" });
    expect(updated.title).toBe("Updated Title");
  });

  it("Xoá sách theo ID", async () => {
    await Book.create(sampleBook);
    const res = await request(app).delete("/api/books/S001");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const found = await Book.findOne({ id: "S001" });
    expect(found).toBeNull();
  });

  it("Lọc sách theo tình trạng", async () => {
    await Book.create([
      { ...sampleBook, id: "S003", status: "Borrowed" },
      { ...sampleBook, id: "S004", status: "Available" }
    ]);

    const res = await request(app).get("/api/books/status/Borrowed");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe("Borrowed");
  });
});
