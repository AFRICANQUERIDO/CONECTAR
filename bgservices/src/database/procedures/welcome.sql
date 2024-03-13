create PROCEDURE WelcomeExisting
AS
BEGIN
    SELECT *
    FROM Users
    WHERE welcomed = 0 
END

select * from Users