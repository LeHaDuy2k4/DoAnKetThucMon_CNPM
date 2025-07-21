const nodemailer = require("nodemailer");
require("dotenv").config();

// Tạo transporter dùng Gmail + App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,   // Ví dụ: your_email@gmail.com
    pass: process.env.MAIL_PASS    // App password 16 ký tự
  }
});

// Gửi email quá hạn
exports.sendOverdueReminderEmail = async (toEmail, bookTitle, dueDate) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: toEmail,
    subject: "Nhắc nhở quá hạn trả sách",
    html: `
      <div style="font-family:Arial,sans-serif">
        <p>Chào bạn,</p>
        <p>Cuốn sách <strong>${bookTitle}</strong> bạn mượn đã <span style="color:red"><strong>quá hạn</strong></span> từ ngày <strong>${new Date(dueDate).toLocaleDateString("vi-VN")}</strong>.</p>
        <p>Vui lòng trả sách sớm để tránh bị phạt.</p>
      </div>
    `
  });
};

// Gửi email sắp đến hạn
exports.sendUpcomingReminderEmail = async (toEmail, bookTitle, dueDate) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: toEmail,
    subject: "Nhắc nhở sắp đến hạn trả sách",
    html: `
      <div style="font-family:Arial,sans-serif">
        <p>Chào bạn,</p>
        <p>Cuốn sách <strong>${bookTitle}</strong> bạn mượn sẽ đến hạn trả vào ngày <strong>${new Date(dueDate).toLocaleDateString("vi-VN")}</strong>.</p>
        <p>Vui lòng sắp xếp để trả đúng hạn.</p>
      </div>
    `
  });
};
