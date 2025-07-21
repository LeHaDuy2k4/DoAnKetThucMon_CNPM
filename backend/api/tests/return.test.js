const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const Return = require("../models/return.model");
const { MongoMemoryServer } = require("mongodb-memory-server");
const connectDB = require("../config/db");

let mongoServer;

describe("API /api/returns", () => {
  jest.setTimeout(15000);

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
    await Return.deleteMany();
  });

  it("Thêm phiếu trả thành công", async () => {
    const res = await request(app).post("/api/returns/add").send({
      madocgia: "DG01",
      matra: "T01",
      tinhtrang: "Bình thường",
      maphat: "P01",
      returnDate: "2025-07-15"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/trả sách thành công/i);
    expect(res.body.data.matra).toBe("T01");
  });

  it("Không thêm nếu thiếu thông tin", async () => {
    const res = await request(app).post("/api/returns/add").send({
      madocgia: "DG01",
      tinhtrang: "Bình thường"
      // thiếu matra và returnDate
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/vui lòng điền đầy đủ/i);
  });

  it("Lấy danh sách phiếu trả", async () => {
    await Return.create({
      madocgia: "DG02",
      matra: "T02",
      tinhtrang: "Mất sách",
      maphat: "P02",
      returnDate: "2025-07-10"
    });

    const res = await request(app).get("/api/returns");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].matra).toBe("T02");
  });

  it("Cập nhật phiếu trả", async () => {
    const ret = await Return.create({
      madocgia: "DG03",
      matra: "T03",
      tinhtrang: "Bình thường",
      maphat: "",
      returnDate: "2025-07-13"
    });

    const res = await request(app)
      .put(`/api/returns/${ret._id}`)
      .send({ tinhtrang: "Mất sách" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.tinhtrang).toBe("Mất sách");
  });

  it("Xoá phiếu trả", async () => {
    const ret = await Return.create({
      madocgia: "DG04",
      matra: "T04",
      tinhtrang: "Mất sách",
      maphat: "P03",
      returnDate: "2025-07-14"
    });

    const res = await request(app).delete(`/api/returns/${ret._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/xoá phiếu trả thành công/i);
  });
});
