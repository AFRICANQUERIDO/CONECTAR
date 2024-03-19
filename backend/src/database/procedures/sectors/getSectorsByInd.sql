CREATE  OR ALTER PROCEDURE getAllSectorsByIndustry
    @industryID VARCHAR(255)
AS
BEGIN
    SELECT s.*
    FROM Sector s
    WHERE s.industryID = @industryID;
END;

-- DROP PROCEDURE getAllSectorsByIndustry