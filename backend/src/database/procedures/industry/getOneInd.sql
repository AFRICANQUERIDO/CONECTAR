CREATE OR ALTER PROCEDURE getOneIndustry (@industryID VARCHAR(255))
AS
BEGIN
    SELECT * FROM industry WHERE industryID = @industryID
END