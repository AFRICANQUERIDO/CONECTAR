CREATE OR ALTER PROCEDURE registerUser(
    @userID VARCHAR(100),
    @Name VARCHAR(200),
    @email VARCHAR(250),
    @password VARCHAR(100),
    @role VARCHAR(20)
   
)

AS
BEGIN
     INSERT INTO UserDetails(userID,Name,email,password,role)
     VALUES(@userID, @Name,@email,@password,@role)
END

-- DROP PROCEDURE registerUser;

UPDATE UserDetails SET role = 'admin' WHERE email = 'janengene12@gmail.com';
