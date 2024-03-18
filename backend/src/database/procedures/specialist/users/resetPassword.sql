CREATE OR ALTER PROCEDURE resetPassword(
    @email VARCHAR(250),
    @newPassword VARCHAR(100)
)

AS
BEGIN
    SET NOCOUNT ON
    IF EXISTS (SELECT * FROM Users WHERE email = @email)
    BEGIN
    
        UPDATE Users 
        SET password = @newPassword
        WHERE email = @email

        SELECT 'Password updated successfully.' AS message;
        RETURN 1
    END
    ELSE
    BEGIN
        SELECT 'Invalid email.' AS message;
    END
END;