CREATE TABLE  Message (
    author_email VARCHAR(255),
    chatId VARCHAR(255),
    message TEXT,
    timestamp DATETIME DEFAULT GETDATE()
);