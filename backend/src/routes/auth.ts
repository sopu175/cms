import { Router } from 'express';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [admin, editor, author, customer]
 *                 default: customer
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', [
  body('username').isLength({ min: 3, max: 50 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'editor', 'author', 'customer']),
  handleValidationErrors
], (req, res) => {
  // Temporary mock response
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: 'mock-user-id',
        username: req.body.username,
        email: req.body.email,
        role: req.body.role || 'customer'
      },
      token: 'mock-jwt-token'
    },
    message: 'User registered successfully'
  });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
], (req, res) => {
  // Temporary mock response
  res.json({
    success: true,
    data: {
      user: {
        id: 'mock-user-id',
        username: 'mockuser',
        email: req.body.email,
        role: 'admin'
      },
      token: 'mock-jwt-token'
    },
    message: 'Login successful'
  });
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', (req, res) => {
  // Temporary mock response
  res.json({
    success: true,
    data: {
      id: 'mock-user-id',
      username: 'mockuser',
      email: 'admin@dccms.com',
      role: 'admin',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', [
  body('username').optional().isLength({ min: 3, max: 50 }),
  body('avatar_url').optional().isURL(),
  handleValidationErrors
], (req, res) => {
  // Temporary mock response
  res.json({
    success: true,
    data: {
      id: 'mock-user-id',
      username: req.body.username || 'mockuser',
      email: 'admin@dccms.com',
      role: 'admin',
      avatar_url: req.body.avatar_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    message: 'Profile updated successfully'
  });
});

export default router;