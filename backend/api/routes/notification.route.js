const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

router.post("/send-overdue", notificationController.sendOverdueEmails);
router.post("/send-upcoming", notificationController.sendUpcomingDueReminders); // <--- thêm dòng này

module.exports = router;
