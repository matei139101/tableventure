-- DROPS EVERYTHING FOR DEVELOPMENT PURPOSES!
DROP TABLE IF EXISTS adventure_messages;
DROP TABLE IF EXISTS adventures;
DROP TABLE IF EXISTS users;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  superuser BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(1000) NOT NULL
);
CREATE INDEX ON adventures(user_id);

CREATE TABLE adventure_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adventure_id UUID NOT NULL REFERENCES adventures(id) ON DELETE CASCADE,
  text VARCHAR(1000) NOT NULL
);
CREATE INDEX ON adventure_messages(adventure_id);
