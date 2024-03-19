CREATE OR ALTER PROCEDURE createIndustry(
    @industryID VARCHAR(255),
    @industryName VARCHAR(255),
    @industryImage VARCHAR(255)
)
AS
BEGIN
    INSERT INTO industry(industryID, industryName, industryImage)
    VALUES(@industryID, @industryName, @industryImage)
END