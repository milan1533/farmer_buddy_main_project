
import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(req.cookies)
    
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated WHILE TOKEN CHECK",
        success: false,
      });
    }
    
    const secretCode = process.env.SECRET_CODE || 'your-secret-key';
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