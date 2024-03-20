CREATE OR ALTER PROCEDURE CalculateGigAverageRatings
AS
BEGIN
    SET NOCOUNT ON;

    -- Delete existing data from GigAverageRatings table
    TRUNCATE TABLE GigAvgRatings;

    -- Insert calculated average rating per gig into GigAverageRatings table
    INSERT INTO GigAvgRatings (gigID, gigName, averageRating)
    SELECT 
        Gig.gigID,
        Gig.gigName,
        AVG(CONVERT(DECIMAL(10, 2), Review.rating)) AS averageRating
    FROM 
        Gig
    LEFT JOIN 
        Orders ON Gig.gigID = Orders.gigID
    LEFT JOIN 
        ReviewsTable Review ON Orders.orderID = Review.orderID
    WHERE 
        Orders.status = 'completed'
    GROUP BY 
        Gig.gigID, Gig.gigName;
END;
