require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/api/users', usersRouter);

app.listen(8080, () => console.log('Server running on port 8080'));
