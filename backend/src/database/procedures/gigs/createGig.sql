
CREATE OR ALTER PROCEDURE CreateGig (
    @gigID VARCHAR(255),
    @gigName VARCHAR(255),  
    @gigImage VARCHAR(255),
    @gigDescription VARCHAR(255),
    @rate VARCHAR(255),
    @userID VARCHAR(255)
)
AS
BEGIN
    -- Insert the gig into the gigs table
    INSERT INTO Gig (gigID, gigName, gigImage,gigDescription, rate, userID)
    VALUES (@gigID, @gigName,@gigImage,@gigDescription, @rate, @userID);

END 
