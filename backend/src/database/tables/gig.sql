-- CREATE TABLE gigs (
--      gigID VARCHAR(255) PRIMARY KEY,
--     gigName VARCHAR(255),
--     userID VARCHAR(100), 
--     industryID VARCHAR(255),
--     sectorID VARCHAR(255),
--     FOREIGN KEY (industryID) REFERENCES industry(industryID),
--     FOREIGN KEY (userID) REFERENCES UserDetails(userID),
--     FOREIGN KEY (sectorID) REFERENCES Sector(sectorID)
-- );

-- SELECT * FROM gigs;


-- drop table gigs

CREATE TABLE Gig(
    gigID VARCHAR(255) PRIMARY KEY,
    gigName VARCHAR(255) NOT NULL,  
    gigImage VARCHAR(255) NOT NULL,
    gigDescription VARCHAR(255) NOT NULL,
    rate VARCHAR(255)

)

-- ALTER TABLE Gig ADD industryID VARCHAR(255)

-- ALTER TABLE Gig ADD sectorID VARCHAR(255)
-- ALTER TABLE Gig ADD userID VARCHAR(255)
-- drop table Gig

-- ALTER TABLE Gig
-- ADD userID VARCHAR(255) NULL, -- Change the data type and size as per your existing UserDetails table
-- FOREIGN KEY (userID) REFERENCES UserDetails(userID);

select * from Gig

DROP TABLE Gig



