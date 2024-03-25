export interface Gigs{
    gigID: string;
    gigName: string;
    gigImage: string;
    gigDescription: string;
    rate: string;
    Name:string;
    experience:string;
    education:string;
    userID: string;
}

export interface gigDetails{
        gigDescription: string;
        gigID: string;
        gigImage: string;
        gigName: string;
        userID: string;
        Name: string;
        email: string;
        password: string;
        phone_number: string;
        DOB: string;
        gender: string;
        education: string;
        experience: string;
        language: string;
        about: string;
        nickname: string;
        country: string;
        city: string;
        industry: string;
        profile_pic: string;
        OTP: string;
        role: string;
        industryID: string;
        industryName: string;
        sectorID: string;
        sectorName: string;
      }
export interface GigResponse{
  gig:[{
    gigDescription: string;
    gigID: string;
    gigImage: string;
    gigName: string;
    userID: string;
    Name: string;
    email: string;
    password: string;
    phone_number: string;
    DOB: string;
    gender: string;
    education: string;
    experience: string;
    language: string;
    about: string;
    nickname: string;
    country: string;
    city: string;
    industry: string;
    profile_pic: string;
    OTP: string;
    role: string;
    industryID: string;
    industryName: string;
    sectorID: string;
    sectorName: string;
  }]
        
      }


      export interface Order {
        gigID: string;
       orderDescription: string;
       startDate: string;
       endDate: string;
       quantity: number;
       totalAmount: number;
       status: string;
        userID: string;
      }