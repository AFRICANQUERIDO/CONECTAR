import { Injectable } from '@angular/core';
import { UserResponse, profileDetails, Users, ViewUsers, loginDetails, signUpDetails, updatedUser } from '../intefaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { OTP } from '../intefaces/otp';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  token = localStorage.getItem('token') as string;
  constructor(private http: HttpClient) { }
  

  setRole(userId: string, role:string){
    return this.http.put<{success: string}>(`http://localhost:3900/users/set-role/${userId}`, role)
  }
  signUpUser(sign_details: signUpDetails) {
    return this.http.post<{ users: Users[], message: string, error: string }>('http://localhost:4500/users/register', sign_details)
  }
  validateUser(userID: string, OTP: string): Observable<any> {
    return this.http.post<OTP>(` http://localhost:4500/users/validate/${userID}`, { OTP });
  }
  loginUser(user_details: loginDetails) {
    return this.http.post<{ message: string, token: string, role: string, error: string }>('http://localhost:4500/users/login', user_details)
  }


  resetPassword(email: string, password: string): Observable<any> {
    const resetData = { email, password };
    {
      return this.http.put<{ message: string, error: string }>('http://localhost:4500/users/reset_pwd', resetData);
    }
  }

  getAllUsers() {
    return this.http.get<{ users: ViewUsers[], error: string }>(`http://localhost:4500/users`, {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': this.token
      })
    })
  }
  getOneUser(id: string) {
    return this.http.get<{ user: Users[] }>(`http://localhost:4500/users/${id}`, {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': this.token
      })
    })
  }

  deleteUser(id: string) {
    return this.http.delete(`http://localhost:4500/users/delete/${id}`, {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': this.token
      })
    })
  }

  createProfile(id:string, details:profileDetails){
    return this.http.put<{message:string, error:string}>(`http://localhost:4500/users/profile/{id}`, details, {
      headers:new HttpHeaders({
        'Content-type': 'application/json',
        'token': this.token
      })
    })
  }

  updateUserDetails(id: string, details: updatedUser) {
    return this.http.put<{ message: string, error: string }>(`http://localhost:4500/users/update/{id}`, details, {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': this.token
      })
    })
  }


  // updateUser(userDetails: updateUserDetails, userId: string){
  //   return this.http.put<{success: string}>(`http://localhost:4500/users/update-details/${userId}`, userDetails)
  // }


 
}
