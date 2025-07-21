const express = require('express');
const router = express.Router();
const Return = require('../models/return.model');

// POST - Thêm phiếu trả
router.post('/add', async (req, res) => {
  try {
    const { madocgia, matra, tinhtrang, maphat, returnDate } = req.body;

    // Kiểm tra bắt buộc
    if (!madocgia || !matra || !tinhtrang || !returnDate) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc." });
    }

    const tra = new Return({ madocgia, matra, tinhtrang, maphat, returnDate });
    await tra.save();
    res.status(201).json({ message: "Trả sách thành công", data: tra });
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi trả sách", error: err.message });
  }
});

// GET - Lấy danh sách phiếu trả
router.get('/', async (req, res) => {
  try {
    const returns = await Return.find().sort({ createdAt: -1 });
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách trả sách" });
  }
});

// PUT - Cập nhật phiếu trả
router.put('/:id', async (req, res) => {
  try {
    const updated = await Return.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy phiếu trả' });
    res.json({ message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật', error: err.message });
  }
});

// DELETE - Xóa phiếu trả
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Return.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy phiếu trả' });
    res.json({ message: 'Đã xoá phiếu trả thành công' });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi xoá', error: err.message });
  }
});

module.exports = router;
