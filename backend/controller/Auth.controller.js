import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password, role, address, city, zipCode, phone } = req.body;
    
    console.log('Registration request:', { name, email, role, address, city, zipCode });
    
    if (!name || !email || !password || !role || !address || !city || !zipCode) {
      return res.status(400).json({
        message: "All required fields are missing",
        success: false
      })
    }
    
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already Exist",
        success: false
      })
    }
    
    const hashPassword = await bcrypt.hash(password, 10);

    // Convert role to lowercase for consistency
    const normalizedRole = role.toLowerCase();

    const newUser = await User.create({
      name,
      email,
      phone,
      password_hash: hashPassword,
      role: normalizedRole,
      location: {
        address,
        city,
        zipCode
      }
    })
    
    console.log('User created successfully:', newUser._id);
    
    return res.status(201).json({
      message: "User Created Successfully",
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message
    });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('Login request:', { email, role });

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required.",
        success: false
      });
    }

    console.log("DONE")

  

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
        success: false
      });
    }

    console.log("NOT")

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
        success: false
      });
    }

    if (role.toLowerCase() !== user.role.toLowerCase()) {
      return res.status(403).json({
        message: 'Role mismatch. Access denied.',
        success: false
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_CODE, {
      expiresIn: '1d'
    });

    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
    };

    console.log('Login successful for user:', user._id);

    return res
      .status(200)
      .cookie("token", token, { httpOnly: true, secure: true })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
        user: responseUser,
        token
      });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: "Internal Server Error during login",
      success: false,
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out Successfully",
      success: true
    })
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
}