CREATE TABLE sectors(
    sectorID VARCHAR(255),
    sectorName VARCHAR(255),
    industryID VARCHAR(255)
     FOREIGN KEY (industryID) REFERENCES industry(industryID)
)

