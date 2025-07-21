const Borrow = require('../models/borrow.model');

exports.getBorrowStats = async (req, res) => {
  try {
    const openCount = await Borrow.countDocuments({ status: 'open' });
    const closedCount = await Borrow.countDocuments({ status: 'closed' });
    const overdueCount = await Borrow.countDocuments({ status: 'overdue' });

    res.json({
      open: openCount,
      closed: closedCount,
      overdue: overdueCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
