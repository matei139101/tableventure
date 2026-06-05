import express from 'express';
const router = express.Router();
import db from '../db/index.js';
import { requireAuth } from './auth.js';

/*
 * @route GET /api/users/get
 * @desc Returns authenticated user information
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 *
 * @returns {Object} 200 - User information
 * @returns {Object} 500 - Error message
 */
router.get('/get', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, superuser FROM users WHERE id = $1', [req.user.id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
