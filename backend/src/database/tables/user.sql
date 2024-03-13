CREATE TABLE Users(
    userID VARCHAR(100) PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL,
    welcomed BIT Default 0,
    isVerified BIT DEFAULT 0
)

select * from Users

-- ALTER TABLE Users
-- ADD isVerified BIT DEFAULT 0;
-- UPDATE Users SET isVerified = 0;

    -- role VARCHAR(100) DEFAULT 'customer',

-- UPDATE Users SET role='Admin' where email='janengene12@gmail.com' 

-- DROP TABLE Users