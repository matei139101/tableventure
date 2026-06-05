import express from 'express';
const router = express.Router();
import db from '../db/index.js';
import { requireAuth } from './auth.js';

/*
 * @route GET /api/adventures/get
 * @desc Returns all adventures linked to the authenticated user
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 *
 * @returns [{Object}] 200 - Array of adventures
 * @returns {Object} 500 - Error message
 */
router.get('/get', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM adventures WHERE user_id = $1 ORDER BY title DESC', [req.user.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route POST /api/adventures/create
 * @desc Creates an adventure linked to the authenticated user
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 * @param {string} req.body.title - Adventure title
 * @param {string} req.body.description - Adventure description
 *
 * @returns {Object} 201 - Adventure created
 * @returns {Object} 500 - Error message
 */
router.post('/create', requireAuth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const result = await db.query('INSERT INTO adventures (title, description, user_id) VALUES ($1, $2, $3) RETURNING id', [title, description, req.user.id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route DELETE /api/adventures/delete
 * @desc Deletes an adventure linked to the authenticated user
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 * @param {string} req.query.id - Adventure ID
 *
 * @returns {Object} 200 - Adventure deleted
 * @returns {Object} 500 - Error message
 */
router.delete('/delete', requireAuth, async (req, res) => {
  const { id } = req.query;

  try {
    const result = await db.query('DELETE FROM adventures WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    res.status(200).json({ message: "Adventure deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route GET /api/adventures/get
 * @desc Returns all messages from to the provided adventure linked to authenticated user
 * @access Private
 *
 * @param {string} req.query.adventure - Adventure ID
 * @param {string} req.headers.authorization - Bearer token
 *
 * @returns [{Object}] 200 - Array of messages
 * @returns {Object} 500 - Error message
 */
router.get('/messages', requireAuth, async (req, res) => {
  const { adventure } = req.query;

  try {
    const result = await db.query('SELECT * FROM adventure_messages WHERE adventure_id = $1', [adventure]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

/*
 * @route POST /api/adventures/messages/create
 * @desc Creates a message linked to the provided adventure
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 * @param {string} req.body.text - Adventure title
 *
 * @returns {Object} 201 - Message created
 * @returns {Object} 500 - Error message
 */
router.post('/messages/create', requireAuth, async (req, res) => {
  const { adventure_id, text } = req.body;

  try {
    await db.query('INSERT INTO adventure_messages (adventure_id, text) VALUES ($1, $2)', [adventure_id, text]);
    res.status(201).json({ message: "Message created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route DELETE /api/adventures/messages/delete
 * @desc Deletes a message linked to the provided adventure
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 * @param {string} req.query.id - Message ID
 *
 * @returns {Object} 201 - Message deleted
 * @returns {Object} 500 - Error message
 */
router.delete('/messages/delete', requireAuth, async (req, res) => {
  const { id } = req.query;

  try {
    await db.query('DELETE FROM adventure_messages WHERE id=$1', [id]);
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
