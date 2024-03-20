CREATE TABLE UserDetails(
    userID VARCHAR(100) PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL,
    profile_pic VARCHAR(255) NULL,
    phone_number VARCHAR(100) NULL,
    DOB VARCHAR(100) NULL,
    gender VARCHAR(100) NULL,
    education VARCHAR(100) NULL,
    experience VARCHAR(100) NULL,
    language VARCHAR(100) NULL,
    about VARCHAR(255) NULL,
    nickname VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    industry VARCHAR(100) NULL,
    OTP VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    welcomed BIT Default 0,
    isVerified BIT DEFAULT 0,

)

select * from UserDetails

-- UPDATE UserDetails SET role='Admin' where email='janengene12@gmail.com' 

-- DROP TABLE Users
ALTER TABLE UserDetails ADD profile_id VARCHAR(255) NULL;

-- SELECT OTP FROM Users WHERE userID = @userID;






