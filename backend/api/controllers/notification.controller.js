const { Book } = require("../models/book.model");
const {
  sendUpcomingReminderEmail,
  sendOverdueReminderEmail
} = require("../utils/mailer");

// Gửi email nhắc sách sắp đến hạn (trước 3 ngày)
exports.sendUpcomingDueReminders = async (req, res) => {
  try {
    const today = new Date();
    const reminderDate = new Date();
    reminderDate.setDate(today.getDate() + 3); // nhắc trước 3 ngày
    reminderDate.setHours(0, 0, 0, 0);

    const books = await Book.find({
      status: "Borrowed",
      dueDate: {
        $gte: reminderDate,
        $lt: new Date(reminderDate.getTime() + 24 * 60 * 60 * 1000)
      },
      email: { $exists: true, $ne: "" }
    });

    if (books.length === 0) {
      return res.json({ message: "Không có sách sắp đến hạn." });
    }

    const results = [];

    for (const book of books) {
      try {
        await sendUpcomingReminderEmail(book.email, book.title, book.dueDate);
        results.push({ email: book.email, status: "Sent" });
      } catch (error) {
        results.push({ email: book.email, status: "Failed", error: error.message });
      }
    }

    res.json({ message: `Đã gửi ${results.length} email nhắc trước hạn`, results });
  } catch (err) {
    res.status(500).json({ message: "Lỗi gửi nhắc trước hạn", error: err.message });
  }
};

// Gửi email nhắc sách quá hạn
exports.sendOverdueEmails = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const books = await Book.find({
      status: "Borrowed",
      dueDate: { $lt: today },
      email: { $exists: true, $ne: "" }
    });

    if (books.length === 0) {
      return res.json({ message: "Không có sách quá hạn." });
    }

    const results = [];

    for (const book of books) {
      try {
        await sendOverdueReminderEmail(book.email, book.title, book.dueDate);
        results.push({ email: book.email, status: "Sent" });
      } catch (error) {
        results.push({ email: book.email, status: "Failed", error: error.message });
      }
    }

    res.json({ message: `Đã gửi ${results.length} email nhắc quá hạn`, results });
  } catch (err) {
    res.status(500).json({ message: "Lỗi gửi nhắc quá hạn", error: err.message });
  }
};
