import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {

  constructor() { }

  getToken(): string | null {
    // Retrieve the token from localStorage or wherever you store it
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
}
