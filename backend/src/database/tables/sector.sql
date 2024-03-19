CREATE TABLE Sector(
    sectorID VARCHAR(255) PRIMARY KEY NOT NULL,
    sectorName VARCHAR(255) NOT NULL,
    industryID VARCHAR(255)
    FOREIGN KEY (industryID) REFERENCES industry(industryID)
)

-- ALTER TABLE sectors
-- ADD gigID VARCHAR(255);

-- ALTER TABLE sectors
-- ADD CONSTRAINT fk_gigID FOREIGN KEY (gigID) REFERENCES gigs(gigID);







