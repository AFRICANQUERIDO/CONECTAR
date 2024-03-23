import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'token';

   role!: string;

  private user: any = null;

  token = localStorage.getItem('token') as string;
  checkUserDetails(token: string) {
    throw new Error('Method not implemented.');
  }


  constructor(private http: HttpClient) { }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) {
      console.error('Token not found');
      return null;
    }
    const decodedToken = this.decodeToken(token);
    if (decodedToken) {
      return decodedToken.Email;
    } else {
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  authUser() : any {
    return this.user
  }
  
  setUser(value : any) {
    this.user = value;
  }  
  getStoredUser(): any {
    const storedUser = localStorage.getItem(this.USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }
  
  readToken(token: string) {
    return this.http.get<{ info: { userID: string, Name: string, email: string, role: string } }>('http://localhost:4500/users/checkdetails',
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json',
          'token': token
        })
      }).pipe(tap((details: any) => console.log(details)))
  }
}
