import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conversation, Message } from '../intefaces/message';
import { ChatIdModel } from '../intefaces/chatiDModel';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:4500/conversation'; 
  private baseUrl1 = 'http://localhost:4500/message';
  
  constructor(private http: HttpClient) { }

  async getMyConversations(): Promise<Observable<Conversation[]>> {
    return await this.http.get<Conversation[]>(`${this.apiUrl}/my-conversation`);
  }

  getConversationById(id: string): Observable<Conversation> {
    return this.http.get<Conversation>(` http://localhost:4500/conversation/get-by-id/${id}`);
  }

  createConversation(conversation: Conversation): Observable<ChatIdModel> {
    return this.http.post<any>(` http://localhost:4500/conversation/create`, conversation);
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


  createMessage(newMessage: Message): Observable<any> {
    console.log(newMessage)
    return this.http.post(`${this.baseUrl1}/create`, newMessage);
  }

  getAllMessages(): Observable<any> {
    return this.http.get(`${this.baseUrl1}`);
  }

  async getMessageByChatId(ChatId:string ):Promise<Observable<Message[]>> {
    return await this.http.get<Message[]>(`${this.baseUrl1}/get-by-id/${ChatId}`);
}

 
   updateMessage(updatedMessage: Message): Observable<any> {
     return this.http.put<any>(`${this.apiUrl}update/${updatedMessage.chatId}`, updatedMessage);
   }
 
   deleteMessage(messageId: string): Observable<any> {
     return this.http.delete<any>(`${this.apiUrl}delete/${messageId}`);
   }
}