const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Account = require("./models/account.model");

mongoose.connect("mongodb://localhost:27017/cmpm_db", { useNewUrlParser: true, useUnifiedTopology: true });

(async () => {
  try {
    const users = [
      { username: "admin", password: "123", role: "admin" },
      { username: "huong", password: "1234", role: "nhanvien" },
      { username: "duy", password: "12345", role: "nhanvien" }
    ];

    for (const u of users) {
      const existingUser = await Account.findOne({ username: u.username });
      if (existingUser) {
        console.log(`Tài khoản ${u.username} đã tồn tại`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(u.password, 10);
      await Account.create({
        username: u.username,
        password: hashedPassword,
        email: `${u.username}@example.com`,
        phone: "0123456789",
        role: u.role
      });
      console.log(`Tạo tài khoản ${u.username} thành công`);
    }
  } catch (err) {
    console.error("Lỗi khi tạo tài khoản:", err);
  } finally {
    mongoose.disconnect();
  }
})();
