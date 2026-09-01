-- Add pushToken column to User table (if it doesn't exist)
ALTER TABLE User ADD COLUMN pushToken TEXT;

-- Create Notification table
CREATE TABLE IF NOT EXISTS Notification (
    id TEXT PRIMARY KEY,
    userId TEXT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);
