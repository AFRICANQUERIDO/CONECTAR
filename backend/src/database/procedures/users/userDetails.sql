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
        userID = @userID AND role != 'admin';
END;

-- SELECT * FROM UserDetails WHERE role != 'admin';

UPDATE UserDetails
SET isVerified = 1
WHERE email = 'gamesmy177@gmail.com';

UPDATE UserDetails
SET isVerified = 1
WHERE email = 'kenidashakt@gmail.com';
