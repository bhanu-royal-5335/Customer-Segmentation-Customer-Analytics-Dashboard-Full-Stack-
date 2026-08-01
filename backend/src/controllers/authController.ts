import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { isMongoConnected } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_customer_segmentation_2026';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (isMongoConnected) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'analyst'
      });

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      // Mock signup fallback
      const token = jwt.sign({ id: 'mock_user_id', email: email.toLowerCase(), role: role || 'analyst' }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        token,
        user: { id: 'mock_user_id', name, email, role: role || 'analyst' }
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password credentials' });
      }

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      // Mock login fallback for smooth out-of-the-box demo
      const token = jwt.sign({ id: 'mock_user_id', email: email.toLowerCase(), role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        token,
        user: { id: 'mock_user_id', name: email.split('@')[0] || 'Demo User', email, role: 'admin' }
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error logging in' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    if (isMongoConnected && req.user?.id) {
      const user = await User.findById(req.user.id).select('-password');
      if (user) {
        return res.json({ success: true, user });
      }
    }
    return res.json({
      success: true,
      user: {
        id: req.user?.id || 'demo_user_1',
        name: 'Demo Lead Analyst',
        email: req.user?.email || 'admin@segmentation.ai',
        role: 'admin'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
