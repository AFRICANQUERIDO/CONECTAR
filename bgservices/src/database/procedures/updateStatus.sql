CREATE OR ALTER PROCEDURE UpdateUserAsWelcomed
   
AS
BEGIN
 UPDATE UserDetails SET welcomed = 1 WHERE welcomed = 0 
END;

SELECT * FROM UserDetails