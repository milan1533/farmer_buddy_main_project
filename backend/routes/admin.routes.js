// routes/admin.routes.js
// ✅ MongoDB/Mongoose removed → Supabase
import express from 'express';
import isAuthenticated from '../middleware/isAutheticated.js';
import { authorizeRoles } from '../middleware/authorizeRole.js';
import supabase from '../config/supabase.js';

const adminRouter = express.Router();

// Protected: Admin only endpoints
adminRouter.get('/overview', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('role');

    if (error) throw error;

    const totalUsers = users.length;
    const roles = users.reduce((acc, u) => {
      const role = (u.role || 'unknown').toLowerCase();
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      message: 'Admin overview',
      data: { totalUsers, roles },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Protected: Admin only - Get users list
adminRouter.get('/users', isAuthenticated, authorizeRoles('admin'), async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data: users.map(u => ({ ...u, _id: u.id }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Public overview (no auth) for community pages
adminRouter.get('/overview-public', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('role');

    if (error) throw error;

    const totalUsers = users.length;
    const roles = users.reduce((acc, u) => {
      const role = (u.role || 'unknown').toLowerCase();
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: { totalUsers, roles },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default adminRouter;
