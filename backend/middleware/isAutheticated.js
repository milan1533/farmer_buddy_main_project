
import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  try {
    // Accept token from multiple common locations to avoid frontend desyncs
    const cookieToken = req.cookies.token || req.cookies.accessToken || req.cookies.jwt || null;
    const headerAuth = req.headers.authorization || req.headers.Authorization || '';
    const bearerToken = headerAuth.startsWith('Bearer ') ? headerAuth.substring(7) : (headerAuth || null);
    const altHeaderToken = req.headers['x-auth-token'] || req.headers['x-access-token'] || req.headers['token'] || null;
    const token = cookieToken || bearerToken || altHeaderToken;
    // console.log(req.cookies)
    
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated WHILE TOKEN CHECK",
        success: false,
      });
    }
    
    const secretCode = process.env.JWT_SECRET || 'your-secret-key';
    const decode = jwt.verify(token, secretCode);

    if (!decode) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log('Auth error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
        success: false,
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired',
        success: false,
      });
    }
    
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default isAuthenticated;