export interface User{
    userID:string;
    Name: string;
    email: string;
    password: string;
    role: string;
    token:string;
}


export interface loginDetails{email:string;
    password:string}
  
    export interface ViewUsers {
        userID:string;
        Name: string;
                email: string;
      }
export interface updatedUser{
    userID:string;
    Name: string;
    email: string;
    password: string;
    // role:string;
}

export interface signUpDetails{
    userID:string;
    Name: string;
    email: string;
    password: string;
}

export interface OTP{
    email:string
    otp:string
    createdAt:Date
    expiresAt:Date
}