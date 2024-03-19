CREATE TABLE gigs (
     gigID VARCHAR(255) PRIMARY KEY,
    gigName VARCHAR(255),
    userID VARCHAR(100), 
    industryID VARCHAR(255),
    sectorID VARCHAR(255),
    FOREIGN KEY (industryID) REFERENCES industry(industryID),
    FOREIGN KEY (userID) REFERENCES UserDetails(userID),
    FOREIGN KEY (sectorID) REFERENCES Sector(sectorID)
);

SELECT * FROM gigs;


-- drop table gigs

