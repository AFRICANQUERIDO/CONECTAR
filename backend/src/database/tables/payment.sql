CREATE TABLE Payment (
    paymentID VARCHAR(100) PRIMARY KEY NOT NULL,
    orderID VARCHAR(100) NOT NULL,
    totalAmount INT NOT NULL,
    paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    paymentMethod VARCHAR(200),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
);


SELECT * FROM Payment