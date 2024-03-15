CREATE OR ALTER PROCEDURE deleteIndustry(
    @industryID VARCHAR(255))
AS
BEGIN
    DELETE FROM industry WHERE industryID = @industryID
END