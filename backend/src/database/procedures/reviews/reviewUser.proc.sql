-- CREATE OR ALTER PROCEDURE getUserReviews
--     @userID VARCHAR(100)
-- AS
-- BEGIN
--     SELECT reviewRating FROM ReviewUserDetails WHERE userDetailsID = @userID;
-- END;

CREATE OR ALTER PROCEDURE getUserReviews
    @userID VARCHAR(100)
AS
BEGIN
    SELECT AVG(CAST(reviewRating AS DECIMAL(5, 2))) AS averageRating
    FROM ReviewUserDetails 
    WHERE userDetailsID = @userID;
END;
