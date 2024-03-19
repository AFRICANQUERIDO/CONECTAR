CREATE OR ALTER PROCEDURE deleteOtpByEmail
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE userDetails
    SET OTP = NULL
    WHERE email = @email;
END;
