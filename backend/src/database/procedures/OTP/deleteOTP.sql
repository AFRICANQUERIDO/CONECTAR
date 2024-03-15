CREATE PROCEDURE deleteOtpByEmail
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE users
    SET otp = NULL
    WHERE email = @email;
END;
