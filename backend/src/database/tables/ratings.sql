CREATE TABLE GigAvgRatings (
    gigID VARCHAR(100) PRIMARY KEY,
    gigName VARCHAR(255),
    averageRating DECIMAL(5, 2)
);

SELECT * FROM GigAvgRatings
-- DROP TABLE GigAvgRatings