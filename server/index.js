import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import adventureRouter from './routes/adventures.js';
import gamestateRoute from './routes/gamestate.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/adventures', adventureRouter);
app.use('/api/gamestate', gamestateRoute);

app.listen(8080, () => console.log('Server running on port 8080'));
