CREATE OR ALTER PROCEDURE updateUser(
    @userID VARCHAR (100),
    @Name VARCHAR(200),
    @email VARCHAR(250)
)
AS BEGIN
    UPDATE Users SET firstName=@Name,email=@email WHERE userID = @userID;

END