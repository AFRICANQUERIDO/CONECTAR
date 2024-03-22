// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../Models/conversation';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/conversation/'; 
  constructor(private http: HttpClient) { }

  getMyConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/api/conversation/my-conversations`);
  }

  getConversationById(id: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/api/conversation/get-by-id/${id}`);
  }

  createConversation(conversation: Conversation): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/conversation/all-conversation`, conversation);
  }

  updateConversation(id: string, conversation: Conversation): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/conversation/update/${id}`, conversation);
  }

  deleteConversation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/conversation/delete/${id}`);
  }
}
