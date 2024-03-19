create or alter PROCEDURE WelcomeExisting
AS
BEGIN
    SELECT *
    FROM UserDetails
    WHERE welcomed = 0 
END

select * from UserDetails