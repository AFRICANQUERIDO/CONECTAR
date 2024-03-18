CREATE TABLE Customers (
    customerID VARCHAR(255) PRIMARY KEY,
    userID VARCHAR(100) NOT NULL,
    industryID VARCHAR(255),
    Name VARCHAR(255),
    email VARCHAR(255) UNIQUE, 
    password VARCHAR(255),
     isAdmin BIT DEFAULT 0,
     isWelcomed BIT DEFAULT 0,
     isDeleted BIT DEFAULT 0,
    FOREIGN KEY (userID) REFERENCES Users(userID)
)

-- DELETE FROM employers

SELECT * FROM customers

-- DROP TABLE Customers