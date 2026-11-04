import bcrypt from 'bcryptjs';
import {
  findFarmerById,
  findFarmerByIdWithPassword,
  updateFarmer,
} from '../services/dataStore.js';

export const getProfile = async (req, res) => {
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
      message: 'Failed to fetch farmer profile.',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name cannot be empty.',
      });
    }

    const updated = await updateFarmer(req.farmer._id, {
      name: name.trim(),
      phone: phone !== undefined ? phone.trim() : req.farmer.phone,
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      farmer: updated,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match.',
      });
    }

    const farmer = await findFarmerByIdWithPassword(req.farmer._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, farmer.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password provided is incorrect.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await updateFarmer(req.farmer._id, { passwordHash: newHash });

    return res.json({
      success: true,
      message: 'Password changed successfully! Please keep your new credentials secure.',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password.',
    });
  }
};
