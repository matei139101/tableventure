import express from 'express';
import sendToOllama from '../services/ollama.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { messages, context } = req.body;
  try {
    const reply = await sendToOllama(messages, context);
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
