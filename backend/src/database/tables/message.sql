CREATE TABLE Message (
    messageId VARCHAR(255) PRIMARY KEY,
    author_email VARCHAR(255),
    chatId VARCHAR(255),
    message TEXT,
    timestamp DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_ChatId FOREIGN KEY (chatId) REFERENCES Conversation(chatId)
);


