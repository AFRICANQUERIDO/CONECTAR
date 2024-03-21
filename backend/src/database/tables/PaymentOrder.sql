CREATE OR ALTER PROCEDURE GetPaymentOrder
AS
BEGIN
    SELECT Orders.*, Payment.*
    FROM Orders
    INNER JOIN Payment ON Orders.orderID = Payment.orderID;
END
