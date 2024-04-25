
CREATE OR ALTER PROCEDURE GetUserReviewRatings
    @userID VARCHAR(100)
AS
BEGIN

    SELECT
        ReviewsTable.rating
    INTO
        UserReviewRatings
    FROM
        ReviewsTable
    JOIN
        Orders ON ReviewsTable.orderID = Orders.orderID
    JOIN
        UserDetails ON Orders.userID = UserDetails.userID
    WHERE
        UserDetails.userID = @userID;
END;


SELECT * FROM UserReviewRatings

EXEC GetUserReviewRatings @userID = '9f9c1cbc-0b8c-4fed-8231-b52523e727e1';
