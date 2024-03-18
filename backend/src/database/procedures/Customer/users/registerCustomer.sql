CREATE OR ALTER PROCEDURE createCustomer (
    @customer_id VARCHAR(100),
    @Name VARCHAR(200),
    @email VARCHAR(250),
    @password VARCHAR(100)
   
)

AS
BEGIN
     INSERT INTO Customers(customer_id,Name,email,password)
     VALUES(@customer_id, @Name,@email,@password)
END





 