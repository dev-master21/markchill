import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { comparePassword, generateToken } from '../utils/auth.utils';
import { AppError, asyncHandler } from '../middleware/error.middleware';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  
  // Check if user exists
  const existingUser = await UserService.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }
  
  // Create user
  const user = await UserService.create({
    name,
    email,
    password,
    phone,
    role: 'customer'
  });
  
  // Generate token
  const token = generateToken(user);
  
  res.status(201).json({
    success: true,
    token,
    user
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Find user with password
  const user = await UserService.findByEmail(email);
  
  if (!user || !user.password) {
    throw new AppError('Invalid credentials', 401);
  }
  
  // Check password
  const isMatch = await comparePassword(password, user.password);
  
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }
  
  // Check if active
  if (!user.is_active) {
    throw new AppError('Account is disabled', 401);
  }
  
  // Remove password from response
  delete user.password;
  
  // Generate token
  const token = generateToken(user);
  
  res.json({
    success: true,
    token,
    user
  });
});

export const getProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await UserService.findById(req.user.id);
  
  res.json({
    success: true,
    user
  });
});

export const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const allowedUpdates = ['name', 'phone', 'address', 'city', 'postal_code', 'country'];
  const updates: any = {};
  
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }
  
  const user = await UserService.update(req.user.id, updates);
  
  res.json({
    success: true,
    user
  });
});

export const changePassword = asyncHandler(async (req: any, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await UserService.findByEmail(req.user.email);
  
  if (!user || !user.password) {
    throw new AppError('User not found', 404);
  }
  
  // Verify current password
  const isMatch = await comparePassword(currentPassword, user.password);
  
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }
  
  // Update password
  await UserService.updatePassword(req.user.id, newPassword);
  
  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

export const getAchievements = asyncHandler(async (req: any, res: Response) => {
  const achievements = await UserService.getAchievements(req.user.id);
  
  res.json({
    success: true,
    achievements
  });
});