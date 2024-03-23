export interface Users{
    userID:string
    firstName:string
    lastName:string
    email:string
    password:string
}

export interface signUpDetails{
    firstName:string
    lastName:string
    email:string
    password:string
}
export interface loginDetails{
    email:string
    password:string
}

export interface updatedUser{
    firstName:string
    lastName:string
    email:string
    password:string
}
export interface ViewUsers {
    userID:string;
    Name: string;
    email: string;
    role:string;
  }

export interface UserResponse{
email: string
Name: string
message: string
role: string
token: string
userID: string
welcomed:string
  }

  export interface profileDetails{
    userID:string,
    profile_pic:string,
    phone_number:string,
    DOB:string,
    gender:string,
    education:string,
    experience:string,
    language:string,
    about:string,
    nickname:string,
    country:string,
    city:string,
    industry:string,
    sector:string
  }