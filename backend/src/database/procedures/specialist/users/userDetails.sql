CREATE OR ALTER PROCEDURE GetUserDetails(
    @userID VARCHAR(100)
)
AS
BEGIN
    SELECT
        userID,
   Name,
        email,
        role
    FROM
        Users
    WHERE
        userID = @userID;
END;