-- CREATE TABLE GigAvgRatings (
--     gigID VARCHAR(100) PRIMARY KEY,
--     gigName VARCHAR(255),
--     averageRating DECIMAL(5, 2)
-- );

-- SELECT * FROM GigAvgRatings
-- DROP TABLE GigAvgRatings


SELECT
    ReviewsTable.reviewID AS reviewID,
    ReviewsTable.orderID AS reviewOrderID,
    ReviewsTable.userID AS reviewUserID,
    ReviewsTable.rating AS reviewRating,
    ReviewsTable.reviewText AS reviewText,
    ReviewsTable.createdAt AS reviewCreatedAt,
    UserDetails.userID AS userDetailsID,
    UserDetails.Name AS userName,
    UserDetails.email AS userEmail,
    UserDetails.password AS userPassword,
    UserDetails.profile_pic AS userProfilePic,
    UserDetails.phone_number AS userPhoneNumber,
    UserDetails.DOB AS userDOB,
    UserDetails.gender AS userGender,
    UserDetails.education AS userEducation,
    UserDetails.experience AS userExperience,
    UserDetails.language AS userLanguage,
    UserDetails.about AS userAbout,
    UserDetails.nickname AS userNickname,
    UserDetails.country AS userCountry,
    UserDetails.city AS userCity,
    UserDetails.industry AS userIndustry,
    UserDetails.OTP AS userOTP,
    UserDetails.role AS userRole,
    UserDetails.welcomed AS userWelcomed,
    UserDetails.isVerified AS userIsVerified
INTO
    ReviewUserDetails
FROM
    ReviewsTable
JOIN
    UserDetails ON ReviewsTable.userID = UserDetails.userID;


SELECT * FROM ReviewUserDetails

