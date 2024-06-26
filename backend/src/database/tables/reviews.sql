CREATE TABLE ReviewsTable (
    reviewID VARCHAR(100) PRIMARY KEY NOT NULL,
    orderID VARCHAR(100) NOT NULL,
    userID VARCHAR(100) NOT NULL,
    rating VARCHAR(100) NOT NULL,
    reviewText VARCHAR(500) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (userID) REFERENCES UserDetails(userID)
);

SELECT * FROM ReviewsTable

CREATE TABLE UserReviewRatings (
    reviewID VARCHAR(100) PRIMARY KEY NOT NULL,
    orderID VARCHAR(100) NOT NULL,
    userID VARCHAR(100) NOT NULL,
    rating VARCHAR(100) NOT NULL,
    reviewText VARCHAR(500) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (userID) REFERENCES UserDetails(userID)
);




-- CREATE TABLE UserReviewRatings (
--     rating VARCHAR(100) NOT NULL
-- );
-- drop table UserReviewRatings