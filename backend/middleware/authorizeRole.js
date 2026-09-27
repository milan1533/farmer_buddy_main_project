// middleware/authorizeRole.js
// ✅ MongoDB/Mongoose removed → Supabase
import supabase from '../config/supabase.js';

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.id) {
        return res.status(401).json({
          message: 'User not authenticated',
          success: false,
        });
      }

      // Fetch user role from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', req.id)
        .single();

      if (error || !user) {
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

      req.user = { ...req.user, role: userRole };
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
