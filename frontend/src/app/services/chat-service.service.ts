import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../Models/conversation';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:3000/api/conversation'; 
  
  constructor(private http: HttpClient) { }

  async getMyConversations(): Promise<Observable<Conversation[]>> {
    return await this.http.get<Conversation[]>(`${this.apiUrl}/my-conversation`);
  }

  getConversationById(id: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/get-by-id/${id}`);
  }

  createConversation(conversation: Conversation): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/all-conversation`, conversation);
  }

  updateConversation(id: string, conversation: Conversation): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, conversation);
  }

  deleteConversation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  getConversationsByEmail(email: string): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/get-by-email/${email}`);
  }
}
