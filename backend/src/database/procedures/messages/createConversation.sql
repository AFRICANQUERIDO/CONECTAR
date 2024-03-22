CREATE PROCEDURE InsertConversation
    @chatId VARCHAR(255),
    @profile_pic VARCHAR(255),
    @last_message VARCHAR(255),
    @nickname VARCHAR(255),
    @sender_email VARCHAR(255),
    @receiver_email VARCHAR(255)
AS
BEGIN
    INSERT INTO Conversation (chatId, profile_pic, last_message, nickname, sender_email, receiver_email)
    VALUES (@chatId, @profile_pic, @last_message, @nickname, @sender_email, @receiver_email);
END;
