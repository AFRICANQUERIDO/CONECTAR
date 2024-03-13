CREATE OR ALTER PROCEDURE registerUser(
    @userID VARCHAR(100),
    @Name VARCHAR(200),
    @email VARCHAR(250),
    @password VARCHAR(100)
   
)

AS
BEGIN
     INSERT INTO Users(userID,Name,email,password)
     VALUES(@userID, @Name,@email,@password)
END

-- DROP PROCEDURE registerUser;