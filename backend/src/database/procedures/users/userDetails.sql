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
        UserDetails
    WHERE
        userID = @userID;
END;