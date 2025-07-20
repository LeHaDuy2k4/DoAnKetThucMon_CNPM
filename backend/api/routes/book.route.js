// routes/taskBook.routes.js
const express = require('express');
const router = express.Router();
const { Book } = require('../models/book.model');
const taskController = require('../controllers/task.controller');

// ========== 📘 BOOK ROUTES ==========

// Thêm sách
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.json({ success: true, message: 'Thêm sách thành công!', book });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm sách: ' + err.message });
  }
});

// Lấy tất cả sách
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Không thể lấy danh sách sách: ' + err.message });
  }
});

// Lấy 1 sách theo id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) return res.status(404).json({ success: false, message: 'Không tìm thấy sách với mã ID này.' });
    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy sách: ' + err.message });
  }
});

// Cập nhật sách
router.put('/:id', async (req, res) => {
  try {
    const updated = await Book.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy sách để cập nhật.' });
    res.json({ success: true, message: 'Cập nhật sách thành công!', book: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật sách: ' + err.message });
  }
});

// Xoá sách
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Không tìm thấy sách để xoá.' });
    res.json({ success: true, message: 'Đã xoá sách thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xoá sách: ' + err.message });
  }
});

// Lọc sách theo tình trạng
router.get('/status/:status', async (req, res) => {
  try {
    const books = await Book.find({ status: req.params.status });
    res.json({ success: true, count: books.length, books });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi lọc sách: ' + err.message });
  }
});

// 📊 Thống kê số sách theo từng trạng thái
router.get('/stats/status', taskController.getTaskStats);

// Gửi nhắc nhở quá hạn
router.post('/reminders/overdue', taskController.sendOverdueReminders);

module.exports = router;
