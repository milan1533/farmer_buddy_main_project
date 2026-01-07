import express from 'express';
import { User } from '../models/user.model.js';

const adminRouter = express.Router();

adminRouter.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const rolesAgg = await User.aggregate([
      { $group: { _id: { $toLower: '$role' }, count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Admin overview',
      data: {
        totalUsers,
        roles: rolesAgg.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {}),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get users list for admin panel (no auth)
adminRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Public overview (no auth) for community pages
adminRouter.get('/overview-public', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const rolesAgg = await User.aggregate([
      { $group: { _id: { $toLower: '$role' }, count: { $sum: 1 } } },
    ]);
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        roles: rolesAgg.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {}),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default adminRouter;
