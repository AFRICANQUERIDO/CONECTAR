CREATE PROCEDURE deActicateIndustry
    @industryID VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Update the industry's status to indicate it's deleted
    UPDATE industry
    SET isDeleted = 1  
    WHERE industryID = @industryID;

    -- Optionally, you can add error handling here
    IF @@ERROR <> 0
    BEGIN
        -- Rollback transaction or handle the error accordingly
        RAISERROR('Error occurred while soft deleting the industry.', 16, 1);
        RETURN;
    END

    -- If no error occurred, return success message
    SELECT 'Industry soft deleted successfully' AS Message;
END
