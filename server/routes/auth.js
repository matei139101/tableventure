import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 *
 * @param(string) req.body.email - The user's email
 * @param(string) req.body.password - The user's password
 *
 * @returns {Object} 200 - JWT containing user
 * @returns {Object} 401 - Invalid credentials
 * @returns {Object} 500 - Error message
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      `
      SELECT id, username, email, password
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0 || !bcrypt.compare(password, result.rows[0].password)) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/**
 * @route POST /api/auth/register
 * @desc Register user
 * @access Public
 *
 * @param(string) req.body.username - The user's username
 * @param(string) req.body.email - The user's email
 * @param(string) req.body.password - The user's password
 *
 * @returns {Object} 500 - Error message
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hash]
    );
    res.status(200)
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;
