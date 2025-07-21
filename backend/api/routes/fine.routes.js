const express = require("express");
const router = express.Router();
const Fine = require("../models/fine.model");

// Thêm phí phạt
router.post("/add", async (req, res) => {
  try {
    const newFine = new Fine(req.body);
    await newFine.save();
    res.status(201).json(newFine);
  } catch (err) {
    res.status(400).json({ error: "Không thể thêm phí phạt", details: err.message });
  }
});

// Lấy danh sách phí phạt
router.get("/", async (req, res) => {
  try {
    const fines = await Fine.find();
    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách phí phạt" });
  }
});

// Sửa phí phạt
router.put("/:maphat", async (req, res) => {
  try {
    const updatedFine = await Fine.findOneAndUpdate(
      { maphat: req.params.maphat },
      req.body,
      { new: true }
    );

    if (!updatedFine) {
      return res.status(404).json({ error: "Không tìm thấy phí phạt để cập nhật" });
    }

    res.json(updatedFine);
  } catch (err) {
    res.status(400).json({ error: "Không thể cập nhật phí phạt", details: err.message });
  }
});

// Xóa phí phạt
router.delete("/:maphat", async (req, res) => {
  try {
    const result = await Fine.deleteOne({ maphat: req.params.maphat });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Không tìm thấy phí phạt để xóa" });
    }

    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: "Không thể xóa phí phạt", details: err.message });
  }
});

module.exports = router;
