import bcrypt from 'bcryptjs';
import {
  findFarmerByEmail,
  createFarmer,
  findFarmerById,
} from '../services/dataStore.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirmation password do not match.',
      });
    }

    // Check duplicate email
    const existing = await findFarmerByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A farmer account with this email address already exists. Please log in.',
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save in DB
    const newFarmer = await createFarmer({
      name: name.trim(),
      email: email.trim(),
      passwordHash,
      phone: phone ? phone.trim() : '',
    });

    const token = generateToken(newFarmer._id);

    return res.status(201).json({
      success: true,
      message: 'Farmer registration successful! Welcome to FarmShield.',
      token,
      farmer: {
        _id: newFarmer._id,
        name: newFarmer.name,
        email: newFarmer.email,
        phone: newFarmer.phone,
        createdAt: newFarmer.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again.',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const farmer = await findFarmerByEmail(email);
    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Verify bcrypt hash
    const isMatch = await bcrypt.compare(password, farmer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const token = generateToken(farmer._id);

    return res.json({
      success: true,
      message: `Welcome back, ${farmer.name}!`,
      token,
      farmer: {
        _id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        createdAt: farmer.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const farmer = await findFarmerById(req.farmer._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found.',
      });
    }
    return res.json({
      success: true,
      farmer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile details.',
    });
  }
};
