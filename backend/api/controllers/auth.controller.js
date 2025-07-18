const Account = require('../models/account.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { username, password, email, phone, role } = req.body;

    const existingUser = await Account.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Tài khoản đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Account({
      username,
      password: hashedPassword,
      email,
      phone,
      role: role || 'docgia' // Mặc định là độc giả nếu không truyền role
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Account.findOne({ username });
    if (!user) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xác thực token
exports.auth = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Xác thực thành công", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// Đăng xuất (bên client chỉ cần xoá token)
exports.logout = (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công" });
};
