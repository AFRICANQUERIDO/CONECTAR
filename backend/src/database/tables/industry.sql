CREATE TABLE industry (
    industryID VARCHAR(255) PRIMARY KEY,
    industryName VARCHAR(255) UNIQUE,
    isDeleted BIT DEFAULT 0
);

SELECT * FROM industry
-- ALTER TABLE industry ADD isDeleted BIT DEFAULT 0

-- UPDATE industry SET isDeleted = 0   

-- ALTER TABLE industry drop COLUMN industryImage

ALTER TABLE industry ADD industryImage VARCHAR(255) 

select * from industry where industryID = 'b83c0ed7-2df5-431c-872b-2aee755bf0b8'