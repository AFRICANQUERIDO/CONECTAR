CREATE PROCEDURE CreateOrder
    @orderID VARCHAR(100),
    @userID VARCHAR(100),
    @gigID VARCHAR(255),
    @orderDescription VARCHAR(255),
    @startDate VARCHAR(50),
    @endDate VARCHAR(50),
    @quantity INT,
    @totalAmount INT,
    @status VARCHAR(20)
AS
BEGIN
    -- Check if the user and gig exist before inserting the order
    IF EXISTS (SELECT 1 FROM UserDetails WHERE userID = @userID) AND EXISTS (SELECT 1 FROM Gig WHERE gigID = @gigID)
    BEGIN
        -- Insert the order into the Orders table
        INSERT INTO Orders (orderID, userID, gigID, orderDescription, startDate, endDate, quantity, totalAmount, status)
        VALUES (@orderID, @userID, @gigID, @orderDescription, @startDate, @endDate, @quantity, @totalAmount, @status);

        -- Return success message
        SELECT 'Order created successfully' AS Message;
    END
    ELSE
    BEGIN
        -- Return error message if user or gig does not exist
        SELECT 'User or gig does not exist' AS Error;
    END
END;
