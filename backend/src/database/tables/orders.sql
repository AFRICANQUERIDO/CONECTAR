CREATE TABLE Orders (
    orderID VARCHAR(100) PRIMARY KEY NOT NULL,
    userID VARCHAR(100) NOT NULL,
    gigID VARCHAR(255) NOT NULL,
    orderDescription VARCHAR(255) NOT NULL,
    startDate VARCHAR(50) NOT NULL,
    endDate VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    totalAmount INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (userID) REFERENCES UserDetails(userID),
    FOREIGN KEY (gigID) REFERENCES Gig(gigID)
);

-- ALTER TABLE Orders ADD orderDescription VARCHAR(255)
-- ALTER TABLE Orders Drop column orderDescriprion

SELECT * FROM Orders