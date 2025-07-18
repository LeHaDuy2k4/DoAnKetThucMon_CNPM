const { Book } = require('../models/book.model');
const nodemailer = require('nodemailer');

// 📘 Lấy tất cả sách
exports.getTasks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📘 Lấy sách theo ID
exports.getTask = async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) return res.status(404).json({ message: 'Task không tồn tại' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📘 Tạo sách mới
exports.createTask = async (req, res) => {
  const { id, title, author, year, genre, status, dueDate, email } = req.body;

  if (!id || !title || !author || !year || !genre) {
    return res.status(400).json({ message: 'Thiếu thông tin sách' });
  }

  try {
    const newBook = new Book({
      id,
      title,
      author,
      year: parseInt(year),
      genre,
      status: status === "Borrowed" ? "Borrowed" : "Available",
      dueDate,
      email
    });

    await newBook.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📘 Cập nhật sách
exports.updateTask = async (req, res) => {
  try {
    const updated = await Book.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task không tồn tại' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📘 Xóa sách
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Book.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Task không tồn tại' });
    res.json({ message: 'Đã xóa task', task: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📘 Lọc sách theo tình trạng
exports.getTasksByStatus = async (req, res) => {
  const status = req.params.status;
  if (!["Available", "Borrowed"].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  try {
    const tasks = await Book.find({ status });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📈 Thống kê sách theo trạng thái
exports.getTaskStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const result = {};
    stats.forEach(s => {
      result[s._id] = s.count;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📧 Gửi nhắc nhở sách quá hạn
exports.sendOverdueReminders = async (req, res) => {
  const now = new Date();

  try {
    const overdueBooks = await Book.find({
      status: 'Borrowed',
      dueDate: { $lt: now },
      email: { $exists: true, $ne: '' }
    });

    if (overdueBooks.length === 0) {
      return res.json({ message: 'Không có sách quá hạn.' });
    }

    // ⚙️ Cấu hình email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kimhuongg0303@gmail.com',        // 👈 sửa email thật của bạn
        pass: 'nmjmzyupphkxyuao'            // 👈 dùng App password chứ KHÔNG dùng mật khẩu Gmail
      }
    });

    for (const book of overdueBooks) {
      const mailOptions = {
        from: 'kimhuongg0303@gmail.com',
        to: book.email,
        subject: `📚 Nhắc nhở: Sách "${book.title}" đã quá hạn`,
        text: `Bạn đã mượn sách "${book.title}" và hạn trả là ${book.dueDate}. Vui lòng hoàn trả sớm nhất có thể.`
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error(`❌ Lỗi gửi email tới ${book.email}:`, err.message);
      }
    }

    res.json({ message: `Đã gửi email cho ${overdueBooks.length} sách quá hạn.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
