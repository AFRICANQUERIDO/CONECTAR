create or alter procedure getAllGigs
as
begin
    select * from GigsWithUserDetailsAndIndustrySector
end
