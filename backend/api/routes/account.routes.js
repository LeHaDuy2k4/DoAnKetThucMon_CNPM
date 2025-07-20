const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/account:
 *   get:
 *     summary: Lấy danh sách tài khoản (chỉ Admin và Nhân viên được phép)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập
 */
router.get("/", verifyToken, requireRole(["admin", "nhanvien"]), (req, res) => {
  res.json([
    { username: "admin", role: "admin" },
    { username: "huong", role: "nhanvien" },
    { username: "duy", role: "nhanvien" }
  ]);
});

/**
 * @swagger
 * /api/account/quanlynhanvien:
 *   get:
 *     summary: Chức năng quản lý nhân viên (chỉ Admin và Nhân viên được phép)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập
 */
router.get("/quanlynhanvien", verifyToken, requireRole(["admin", "nhanvien"]), (req, res) => {
  res.json({ message: "Bạn có quyền truy cập vào chức năng Quản lý nhân viên" });
});

module.exports = router;
