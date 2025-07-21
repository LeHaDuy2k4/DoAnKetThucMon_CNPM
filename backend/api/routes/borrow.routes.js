const express = require('express');
const router = express.Router();
const Borrow = require('../models/borrow.model');

// Thêm phiếu mượn
router.post("/add", async (req, res) => {
  try {
    const newBorrow = new Borrow({ ...req.body, status: 'open' });
    await newBorrow.save();
    res.status(201).json({ message: "Thêm phiếu mượn thành công", borrow: newBorrow });
  } catch (err) {
    res.status(400).json({ message: "Không thể thêm phiếu mượn", error: err.message });
  }
});

// Lấy danh sách
router.get('/', async (req, res) => {
  try {
    const borrows = await Borrow.find().sort({ createdAt: -1 });
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phiếu mượn" });
  }
});

// Cập nhật phiếu
router.put('/:id', async (req, res) => {
  try {
    const updated = await Borrow.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
    res.json({ message: "Cập nhật thành công", borrow: updated });
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi cập nhật phiếu mượn", error: err.message });
  }
});

// Xoá phiếu
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Borrow.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi xoá phiếu mượn", error: err.message });
  }
});

// Thống kê
router.get('/stats', async (req, res) => {
  try {
    await Borrow.updateMany({ status: 'open', returnDate: { $lt: new Date() } }, { $set: { status: 'overdue' } });
    const open = await Borrow.countDocuments({ status: 'open' });
    const closed = await Borrow.countDocuments({ status: 'closed' });
    const overdue = await Borrow.countDocuments({ status: 'overdue' });
    res.json({ open, closed, overdue });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thống kê", error: err.message });
  }
});
// Thống kê số lượt mượn theo tháng
router.get('/stats/monthly', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: { $month: "$borrowDate" }, // gom nhóm theo tháng của ngày mượn
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ];

    const results = await Borrow.aggregate(pipeline);

    // Khởi tạo mảng 12 phần tử mặc định 0
    const counts = new Array(12).fill(0);
    results.forEach(item => {
      counts[item._id - 1] = item.count;
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thống kê theo tháng", error: err.message });
  }
});

module.exports = router;
