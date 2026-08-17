-- schema.sql

CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    firebaseUid TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS Content (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    coverUrl TEXT,
    fileUrl TEXT NOT NULL,
    createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ChatSession (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    currentSummary TEXT,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id)
);
