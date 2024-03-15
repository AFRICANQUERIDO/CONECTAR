CREATE TABLE specialist(
        sellerID VARCHAR(100) PRIMARY KEY,
    userID VARCHAR(100) NOT NULL,
        Name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL,
     industryId VARCHAR(255),
    speciality VARCHAR(255),
    talentWallet VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(255) UNIQUE,
     profileImg VARCHAR(255),
    welcomed BIT Default 0,
    isVerified BIT DEFAULT 0
    FOREIGN KEY (userID) REFERENCES Users(userID),
     FOREIGN KEY (industryID) REFERENCES industry(industryID)
)

SELECT * FROM specialist