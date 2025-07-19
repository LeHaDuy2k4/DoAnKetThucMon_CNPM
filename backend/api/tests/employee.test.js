const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Employee = require("../models/employee.model");
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
  await Employee.deleteMany();
});

describe("API /api/employee", () => {
  const sampleEmployee = {
    manv: "NV01",
    hoten: "Nguyễn Văn A",
    diachi: "TPHCM",
    sdt: "0912345678"
  };

  it("Thêm nhân viên thành công", async () => {
    const res = await request(app).post("/api/employee/add").send(sampleEmployee);

    expect(res.statusCode).toBe(201);
    expect(res.body.employee.manv).toBe("NV01");
  });

  it("Không thêm nếu thiếu trường bắt buộc", async () => {
    const res = await request(app).post("/api/employee/add").send({
      manv: "NV02"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/hoten/);
  });

  it("Lấy danh sách nhân viên", async () => {
    await Employee.create(sampleEmployee);
    const res = await request(app).get("/api/employee");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].hoten).toBe("Nguyễn Văn A");
  });

  it("Cập nhật thông tin nhân viên", async () => {
    await Employee.create(sampleEmployee);
    const res = await request(app)
      .put("/api/employee/NV01")
      .send({ hoten: "Nguyễn Văn B" });

    expect(res.statusCode).toBe(200);
    expect(res.body.employee.hoten).toBe("Nguyễn Văn B");
  });

  it("Xóa nhân viên theo mã", async () => {
    await Employee.create(sampleEmployee);
    const res = await request(app).delete("/api/employee/NV01");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/xoá thành công/i);

    const remaining = await Employee.findOne({ manv: "NV01" });
    expect(remaining).toBeNull();
  });
});
