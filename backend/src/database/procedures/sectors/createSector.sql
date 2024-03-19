CREATE OR ALTER PROCEDURE createSector(
    @sectorID VARCHAR(255),
    @sectorName VARCHAR(255),
    @industryID VARCHAR(255)
)
AS
BEGIN
    INSERT INTO Sector(sectorID,sectorName,industryID)
    VALUES(@sectorID,@sectorName,@industryID)
END

-- SELECT * FROM sector
