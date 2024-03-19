
CREATE OR ALTER PROCEDURE CreateGig (
    @gigID VARCHAR(255),
  @gigName VARCHAR(255),
    @userID VARCHAR(100),
    @industryID VARCHAR(255),
    @sectorID VARCHAR(255)
)
AS
BEGIN
    -- Insert the gig into the gigs table
    INSERT INTO gigs (gigID, gigName, userID, industryID, sectorID)
    VALUES (@gigID, @gigName,@userID,@industryID,@sectorID);

END 