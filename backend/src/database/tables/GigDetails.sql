-- CREATE VIEW GigDetails AS
-- SELECT 
--     Gig.*,
--     industry.*,
--     Sector.*
-- FROM 
--     Gig
-- JOIN 
--     industry ON Gig.industryID = industry.industryID
-- JOIN 
--     Sector ON Gig.sectorID = Sector.sectorID;

-- SELECT * FROM GigDetails;



CREATE VIEW IndustrySectorView AS
SELECT 
    industry.industryID,
    industry.industryName,
    Sector.sectorID,
    Sector.sectorName
FROM 
    industry
JOIN 
    Sector ON industry.industryID = Sector.industryID;

    select * FROM IndustrySectorView

-----creating view with users industry and sector
CREATE VIEW UserDetailsWithIndustrySector AS
SELECT 
    UserDetails.UserID,
    UserDetails.Name,
    UserDetails.Email,
    UserDetails.Password,
    UserDetails.profile_pic,
    UserDetails.phone_number,
    UserDetails.DOB,
    UserDetails.Gender,
    UserDetails.Education,
    UserDetails.Experience,
    UserDetails.Language,
    UserDetails.About,
    UserDetails.Nickname,
    UserDetails.Country,
    UserDetails.City,
    UserDetails.Industry,
    UserDetails.OTP,
    UserDetails.Role,
    IndustrySectorView.industryID,
    IndustrySectorView.industryName,
    IndustrySectorView.sectorID,
    IndustrySectorView.sectorName
FROM 
    UserDetails
JOIN 
    IndustrySectorView ON UserDetails.industry = IndustrySectorView.industryName


    SELECT * FROM UserDetailsWithIndustrySector


-----creating view with gigs users industry and sector
-- CREATE VIEW GigsWithUserDetailsAndIndustrySector AS
-- SELECT 
--     Gig.gigDescription,
--     Gig.gigID,
--     Gig.gigImage,
--     Gig.gigName,
--     UserDetailsWithIndustrySector.*
-- FROM 
--     Gig
-- JOIN 
--     UserDetailsWithIndustrySector ON Gig.userID = UserDetailsWithIndustrySector.UserID;

-- SELECT * FROM GigsWithUserDetailsAndIndustrySector


CREATE VIEW GigsWithUserDetailsAndIndustrySector AS
SELECT 
    Gig.gigDescription,
    Gig.gigID,
    Gig.gigImage,
    Gig.gigName,
    UserDetailsWithIndustrySector.*,
    -- AVG(CAST(ReviewsTable.rating AS DECIMAL(5, 2))) AS avgRating
FROM 
    Gig
JOIN 
    UserDetailsWithIndustrySector ON Gig.userID = UserDetailsWithIndustrySector.UserID
LEFT JOIN
    Orders ON Gig.gigID = Orders.gigID
LEFT JOIN
    ReviewsTable ON Orders.orderID = ReviewsTable.orderID
-- GROUP BY 
--     Gig.gigDescription,
--     Gig.gigID,
--     Gig.gigImage,
--     Gig.gigName
--     UserDetailsWithIndustrySector.*


select * from GigsWithUserDetailsAndIndustrySector