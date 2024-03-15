CREATE TABLE customers (
    customerID VARCHAR(255) PRIMARY KEY,
    userID VARCHAR(100) NOT NULL,
    industryID VARCHAR(255),
    Name VARCHAR(255),
    email VARCHAR(255) UNIQUE, 
    location VARCHAR(255),
    phone VARCHAR(255) UNIQUE,
     profileImg VARCHAR(255),
    welcomed BIT Default 0,
    isVerified BIT DEFAULT 0,
    customerWallet VARCHAR(255) ,
    password VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- DELETE FROM employers

SELECT * FROM customers