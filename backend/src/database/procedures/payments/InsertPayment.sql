CREATE OR ALTER PROCEDURE InsertPayment
    @paymentID VARCHAR(100),
    @orderID VARCHAR(100),
    @totalAmount INT,
  @paymentDate DATETIME,
    @status VARCHAR(20) = 'paid',
    @paymentMethod VARCHAR(50) = 'Stripe' -- Set default values for status and payment method
AS
BEGIN
    INSERT INTO Payment (paymentID, orderID, totalAmount, paymentDate, status, paymentMethod)
    VALUES (@paymentID, @orderID, @totalAmount, @paymentDate, @status, @paymentMethod)
END
