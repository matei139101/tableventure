import express from 'express';
const router = express.Router();
import db from '../db/index.js';
import { requireAuth } from './auth.js';

/*
 * @route GET /api/adventures/
 * @desc Returns all adventures linked to the authenticated user
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 *
 * @returns [{Object}] 200 - Array of adventures
 * @returns {Object} 500 - Error message
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM adventures WHERE user_id = $1 ORDER BY title DESC', [req.user.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route POST /api/adventures/
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
router.post('/', requireAuth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const result = await db.query('INSERT INTO adventures (title, description, user_id) VALUES ($1, $2, $3) RETURNING id', [title, description, req.user.id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route DELETE /api/adventures/:id
 * @desc Deletes an adventure linked to the authenticated user
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 * @param {string} req.params.id - Adventure ID
 *
 * @returns {Object} 200 - Adventure deleted
 * @returns {Object} 500 - Error message
 */
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM adventures WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    res.status(200).json({ message: "Adventure deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route GET /api/messages/:id
 * @desc Returns all messages from to the provided adventure linked to authenticated user
 * @access Private
 *
 * @param {string} req.query.adventure - Adventure ID
 * @param {string} req.headers.authorization - Bearer token
 *
 * @returns [{Object}] 200 - Array of messages
 * @returns {Object} 500 - Error message
 */
router.get('/messages/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM adventure_messages WHERE adventure_id = $1', [id]);
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
 * @param {string} req.params.id - Adventure ID
 * @param {string} req.body.text - Adventure title
 *
 * @returns {Object} 201 - Message created
 * @returns {Object} 500 - Error message
 */
router.post('/messages/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { text } = req.body;

  try {
    await db.query('INSERT INTO adventure_messages (adventure_id, text) VALUES ($1, $2)', [id, text]);
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
 * @param {string} req.params.id - Message ID
 *
 * @returns {Object} 201 - Message deleted
 * @returns {Object} 500 - Error message
 */
router.delete('/messages/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM adventure_messages WHERE id=$1', [id]);
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
