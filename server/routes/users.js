import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import db from '../db/index.js';

/*
 * @route GET /api/users/get/:id
 * @desc Returns all users
 * @access Public
 *
 * @returns [{Object}] 200 - Users returned
 * @returns {Object} 500 - Error message
 */
router.get('/get', async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route GET /api/users/get
 * @desc Returns indexed user
 * @access Public
 *
 * @param(number) req.params.id - The user's ID
 *
 * @returns {Object} 200 - User returned
 * @returns {Object} 500 - Error message
 */
router.get('/get/:id', async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route POST /api/users/create
 * @desc Register a new user
 * @access Public
 *
 * @param(string) req.body.username - The user's username
 * @param(string) req.body.email - The user's email
 * @param(string) req.body.password - The user's password
 *
 * @returns {Object} 201 - The created user
 * @returns {Object} 500 - Error message
 */
router.post('/create', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route PUT /api/users/update/:id
 * @desc Edit a user
 * @access Public
 *
 * @param(number) req.params - The user's ID
 * @param(string) req.body.username - The new username
 * @param(string) req.body.email - The new email
 * @param(string) req.body.passwords - The new password
 *
 * @returns {Object} 201 - The indexed user
 * @returns {Object} 500 - Error message
 */
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [username, email, hash, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route DELETE /api/users/delete/:id
 * @desc Delete a user
 * @access Public
 *
 * @returns 201 - User deleted
 * @returns {Object} 500 - Error message
 */
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id=$1', [id]);
    res.status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
