CREATE OR ALTER PROCEDURE createIndustry(
    @industryID VARCHAR(255),
    @industryName VARCHAR(255)
)
AS
BEGIN
    INSERT INTO industry(industryID, industryName)
    VALUES(@industryID, @industryName)
END