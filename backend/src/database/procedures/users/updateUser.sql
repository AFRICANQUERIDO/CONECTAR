CREATE OR ALTER PROCEDURE updateUser(
    @userID VARCHAR (100),
    @Name VARCHAR(200),
    @email VARCHAR(250)
)
AS BEGIN
    UPDATE UserDetails SET Name=@Name,email=@email WHERE userID = @userID;

END