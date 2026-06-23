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
 * @route GET /api/adventures/:id
 * @desc Returns data associated to an adventure linked to the authenticated user
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 * @param {string} req.params.id - Adventure ID
 *
 * @returns {Object} 200 - Adventure information
 * @returns {Object} 500 - Error message
 */
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM adventures WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.status(200).json(result.rows[0]);
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
  const { title, description, context } = req.body;

  try {
    const result = await db.query('INSERT INTO adventures (title, description, context, user_id) VALUES ($1, $2, $3, $4) RETURNING id', [title, description, context, req.user.id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 * @route PUT /api/adventures/
 * @desc Edits an adventure linked to the authenticated user
 * @access Private
 *
 * @param {string} req.headers.authorization - Bearer token
 * @param {string} req.params.id - Adventure ID
 * @param {string} req.body.title - Adventure title
 * @param {string} req.body.description - Adventure description
 * @param {string} req.body.context - Adventure context
 *
 * @returns {Object} 200 - Adventure edited
 * @returns {Object} 500 - Error message
 */
router.put('/:id', requireAuth, async (req, res) => {
  const { title, description, context } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE adventures SET title = $1, description = $2, context = $3 WHERE id = $4 AND user_id = $5 RETURNING id', [title, description, context, id, req.user.id]
    );
    res.status(200).json(result.rows[0]);
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
    const result = await db.query('SELECT * FROM adventure_messages WHERE adventure_id = $1 ORDER BY created_at ASC', [id]);
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
  const { text, sender } = req.body;

  try {
    await db.query('INSERT INTO adventure_messages (adventure_id, text, sender) VALUES ($1, $2, $3)', [id, text, sender]);
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
