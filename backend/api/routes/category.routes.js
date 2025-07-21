const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');

router.post('/add', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:maTheLoai', async (req, res) => {
  try {
    const updated = await Category.findOneAndUpdate(
      { maTheLoai: req.params.maTheLoai },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thể loại" });
    }
    res.json({ success: true, category: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:maTheLoai', async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ maTheLoai: req.params.maTheLoai });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thể loại" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
