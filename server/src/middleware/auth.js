import jwt from 'jsonwebtoken';
import { findFarmerById } from '../services/dataStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'farmshield_super_secure_jwt_secret_key_2026';

export const generateToken = (farmerId) => {
  return jwt.sign({ id: farmerId }, JWT_SECRET, { expiresIn: '7d' });
};

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to access this resource.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const farmer = await findFarmerById(decoded.id);

    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or session expired.',
      });
    }

    req.farmer = farmer;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};
