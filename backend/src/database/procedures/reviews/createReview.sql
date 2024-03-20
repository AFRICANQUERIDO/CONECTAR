CREATE OR ALTER PROCEDURE CreateReview
@reviewID VARCHAR(100),
    @orderID VARCHAR(100),
    @userID VARCHAR(100),
    @rating Int,
    @reviewText VARCHAR(500)
AS
BEGIN
    INSERT INTO ReviewsTable (reviewID, orderID, userID, rating, reviewText)
    VALUES (@reviewID, @orderID, @userID, @rating, @reviewText);
END;
