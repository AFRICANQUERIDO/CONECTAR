-- CREATE OR ALTER PROCEDURE createProfile (
--     @profile_id VARCHAR(255),
--     @userID VARCHAR(255),
--     @role VARCHAR(255),
--     @profile_pic VARCHAR(255),
--     @phone_number VARCHAR(255),
--     @DOB VARCHAR(255),
--     @gender VARCHAR(255),
--     @education VARCHAR(255),
--     @experience VARCHAR(255),
--     @language VARCHAR(255),
--     @about VARCHAR(255),
--     @nickname VARCHAR(255),
--     @country VARCHAR(255),
--     @city VARCHAR(255),
--     @industry VARCHAR(255)
-- )
-- AS
-- BEGIN
--     -- Insert the profile into the profiles table
--     INSERT INTO UserDetails (profile_id, userID, role, profile_pic, phone_number, DOB, gender, education, experience, language, about, nickname, country, city, industry)
--     VALUES (@profile_id, @userID, @role, @profile_pic, @phone_number, @DOB, @gender, @education, @experience, @language, @about, @nickname, @country, @city, @industry);

-- END;




CREATE OR ALTER PROCEDURE createProfile (
    @userID VARCHAR(255),
    @profile_pic VARCHAR(255),
    @phone_number VARCHAR(255),
    @DOB VARCHAR(255),
    @gender VARCHAR(255),
    @education VARCHAR(255),
    @experience VARCHAR(255),
    @language VARCHAR(255),
    @about VARCHAR(255),
    @nickname VARCHAR(255),
    @country VARCHAR(255),
    @city VARCHAR(255),
    @industry VARCHAR(255),
    @sector VARCHAR(255)
)
AS
BEGIN
    -- Update the user details in the UserDetails table
    UPDATE UserDetails
    SET 
        profile_pic = @profile_pic,
        phone_number = @phone_number,
        DOB = @DOB,
        gender = @gender,
        education = @education,
        experience = @experience,
        language = @language,
        about = @about,
        nickname = @nickname,
        country = @country,
        city = @city,
        industry = @industry,
        sector=@sector
    WHERE userID = @userID;
END;


