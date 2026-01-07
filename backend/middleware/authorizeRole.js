import { User } from '../models/user.model.js';

// Usage: router.get('/admin', isAuthenticated, authorizeRoles('admin'), handler)
export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.id) {
        return res.status(401).json({
          message: 'User not authenticated',
          success: false,
        });
      }

      const user = await User.findById(req.id).select('role');
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          success: false,
        });
      }

      const userRole = (user.role || '').toLowerCase();
      const normalizedAllowed = allowedRoles.map(r => (r || '').toLowerCase());

      if (!normalizedAllowed.includes(userRole)) {
        return res.status(403).json({
          message: 'Forbidden: insufficient role',
          success: false,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: error.message,
      });
    }
  };
};

export default authorizeRoles;
