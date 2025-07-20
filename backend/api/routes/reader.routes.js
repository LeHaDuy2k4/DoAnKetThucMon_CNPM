const express = require('express');
const router = express.Router();
const Reader = require('../models/reader.model');

router.post('/add', async (req, res) => {
  try {
    const reader = new Reader(req.body);
    await reader.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const readers = await Reader.find();
    res.json(readers);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:madocgia', async (req, res) => {
  try {
    const updated = await Reader.findOneAndUpdate(
      { madocgia: req.params.madocgia },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });
    }
    res.json({ success: true, reader: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:madocgia', async (req, res) => {
  try {
    const deleted = await Reader.findOneAndDelete({ madocgia: req.params.madocgia });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
