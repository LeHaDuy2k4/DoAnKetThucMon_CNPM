const express = require('express');
const router = express.Router();
const Author = require('../models/author.model');

// Thêm tác giả
router.post('/add', async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy danh sách tất cả tác giả
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Sửa tác giả theo mã TG
router.put('/:matg', async (req, res) => {
  try {
    const updated = await Author.findOneAndUpdate(
      { matg: req.params.matg },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả để cập nhật' });
    }
    res.json({ success: true, author: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Xoá tác giả theo mã TG
router.delete('/:matg', async (req, res) => {
  try {
    const deleted = await Author.findOneAndDelete({ matg: req.params.matg });
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả để xoá' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
