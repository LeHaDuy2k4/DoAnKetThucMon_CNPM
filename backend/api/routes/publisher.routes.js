const express = require('express');
const router = express.Router();
const Publisher = require('../models/publisher.model');

// Route thêm nhà xuất bản
router.post('/add', async (req, res) => {
  const { manxb, tennxb, diachi, sdt } = req.body;
  try {
    const newPublisher = new Publisher({ manxb, tennxb, diachi, sdt });
    await newPublisher.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// Route lấy danh sách tất cả nhà xuất bản
router.get('/', async (req, res) => {
  try {
    const data = await Publisher.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:manxb', async (req, res) => {
  try {
    const updated = await Publisher.findOneAndUpdate(
      { manxb: req.params.manxb },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản để cập nhật' });
    }
    res.json({ success: true, publisher: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:manxb', async (req, res) => {
  try {
    const deleted = await Publisher.findOneAndDelete({ manxb: req.params.manxb });
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản để xoá' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
