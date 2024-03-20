CREATE OR ALTER PROCEDURE GetAllGigsByUser
(
    @userID VARCHAR(255)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Gig
    WHERE userID = @userID;
END;


-- CREATE OR ALTER PROCEDURE GetAllGigsByUser
-- (
--     @userID VARCHAR(255)
-- )
-- AS
-- BEGIN
--     SET NOCOUNT ON;

--     SELECT g.gigID, g.gigName, g.userID, g.industryID, g.sectorID, 
--            i.industryName, s.sectorName
--     FROM gigs g
--     INNER JOIN industry i ON g.industryID = i.industryID
--     INNER JOIN sectors s ON g.sectorID = s.sectorID
--     WHERE g.userID = @userID;
-- END;
