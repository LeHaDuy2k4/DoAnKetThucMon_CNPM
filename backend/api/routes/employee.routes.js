const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');

// Thêm nhân viên
router.post('/add', async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    await newEmp.save();
    res.status(201).json({ message: 'Đã thêm nhân viên thành công', employee: newEmp });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm nhân viên', error: err.message });
  }
});

// Lấy danh sách nhân viên
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên' });
  }
});

// Sửa thông tin nhân viên
router.put('/:manv', async (req, res) => {
  try {
    const updated = await Employee.findOneAndUpdate(
      { manv: req.params.manv },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json({ message: "Cập nhật thành công", employee: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật", error: err.message });
  }
});

// Xoá nhân viên
router.delete('/:manv', async (req, res) => {
  try {
    const deleted = await Employee.findOneAndDelete({ manv: req.params.manv });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá", error: err.message });
  }
});

module.exports = router;
