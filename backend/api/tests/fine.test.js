const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Fine = require("../models/fine.model");
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
  await Fine.deleteMany();
});

describe("API /api/fines", () => {
  const sampleFine = {
    maphat: "FP001",
    matra: "MT001",
    tienphat: 50000,
    lydo: "Trả trễ hạn"
  };

  it("Thêm phí phạt thành công", async () => {
    const res = await request(app).post("/api/fines/add").send(sampleFine);

    expect(res.statusCode).toBe(201);
    expect(res.body.maphat).toBe("FP001");

    const found = await Fine.findOne({ maphat: "FP001" });
    expect(found).not.toBeNull();
    expect(found.lydo).toBe("Trả trễ hạn");
  });

  it("Không thêm nếu thiếu trường bắt buộc", async () => {
    const res = await request(app).post("/api/fines/add").send({
      maphat: "FP002",
      // thiếu các trường còn lại
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Không thể thêm phí phạt/);
  });

  it("Lấy danh sách phí phạt", async () => {
    await Fine.create(sampleFine);
    const res = await request(app).get("/api/fines");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].maphat).toBe("FP001");
  });

  it("Cập nhật phí phạt thành công", async () => {
    await Fine.create(sampleFine);

    const res = await request(app)
      .put("/api/fines/FP001")
      .send({ tienphat: 60000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.tienphat).toBe(60000);
  });

  it("Không cập nhật được nếu mã không tồn tại", async () => {
    const res = await request(app)
      .put("/api/fines/UNKNOWN")
      .send({ tienphat: 10000 });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/Không tìm thấy phí phạt/);
  });

  it("Xoá phí phạt thành công", async () => {
    await Fine.create(sampleFine);

    const res = await request(app).delete("/api/fines/FP001");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Xóa thành công");

    const found = await Fine.findOne({ maphat: "FP001" });
    expect(found).toBeNull();
  });

  it("Không xoá được nếu mã không tồn tại", async () => {
    const res = await request(app).delete("/api/fines/UNKNOWN");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/Không tìm thấy phí phạt/);
  });
});
