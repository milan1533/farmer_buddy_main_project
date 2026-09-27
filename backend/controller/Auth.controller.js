// controller/Auth.controller.js
// ✅ MongoDB/Mongoose removed → Supabase PostgreSQL
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';
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
      });
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();
      
    if (existingUser) {
      return res.status(400).json({
        message: "User already Exist",
        success: false
      });
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const normalizedRole = role.toLowerCase();

    // Insert into Supabase PostgreSQL
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        password_hash: hashPassword,
        role: normalizedRole,
        location: {
          address,
          city,
          zipCode
        }
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('User created successfully:', newUser.id);
    
    return res.status(201).json({
      message: "User Created Successfully",
      success: true,
      user: {
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message
    });
  }
};

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

    // Find user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
        success: false
      });
    }

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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    const responseUser = {
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
    };

    console.log('Login successful for user:', user.id);

    const isProd = process.env.NODE_ENV === 'production';
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
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
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, name, email, phone, address, city, zipCode } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email.toLowerCase();
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined || city !== undefined || zipCode !== undefined) {
      updates.location = {
        ...(address !== undefined ? { address } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(zipCode !== undefined ? { zipCode } : {}),
      };
    }

    const { data: updated, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error || !updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated',
      user: {
        _id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        location: updated.location,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};