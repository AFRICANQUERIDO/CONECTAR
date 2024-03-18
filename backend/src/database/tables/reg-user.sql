CREATE TABLE CustomerReg(
    userID VARCHAR(100) PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL,
    welcomed BIT Default 0,
    isVerified BIT DEFAULT 0,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' 
)

select * from CustomerReg

ALTER TABLE CustomerReg
ADD OTP VARCHAR(100)

ALTER TABLE CustomerReg
ADD role VARCHAR(20) NOT NULL DEFAULT 'customer' 
-- CHECK (role IN ('customer', 'specialist'));

-- UPDATE Users SET isVerified = 0;

    -- role VARCHAR(100) DEFAULT 'customer',

-- UPDATE Users SET role='Admin' where email='janengene12@gmail.com' 

-- DROP TABLE Users


DECLARE @userID VARCHAR(100);
SET @userID = 'ebedb25d-4db6-41ac-9b37-0a8ce0c375c5';

SELECT OTP FROM Users WHERE userID = @userID;






