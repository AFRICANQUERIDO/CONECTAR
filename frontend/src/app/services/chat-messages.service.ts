import { Injectable } from '@angular/core';
import { Message } from '../Models/message'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService {
private apiUrl = 'http://localhost:3000/api/messages/'; 
  
  constructor(private http: HttpClient) { }


  getDummyChatMessages(): Message[] {
    return [
      {
        "author_email": "martin@gmail.com",
        "chatId": "1",
        "message": "Hey there!",
        "timestamp": "2024-03-20T08:30:00Z"
      },
      {
        "author_email": "leon@gmail.com",
        "chatId": "1",
        "message": "Hi Jane! How are you?",
        "timestamp": "2024-03-20T08:31:00Z"
      },
      {
        "author_email": "martin@gmail.com",
        "chatId": "1",
        "message": "I'm good, thanks! How about you?",
        "timestamp": "2024-03-20T08:32:00Z"
      },
      {
        "author_email": "leon@gmail.com",
        "chatId": "1",
        "message": "I'm doing great, thanks for asking!",
        "timestamp": "2024-03-20T08:33:00Z"
      },
      {
        "author_email": "martin@gmail.com",
        "chatId": "1",
        "message": "That's good to hear!",
        "timestamp": "2024-03-20T08:34:00Z"
      }
    ];
  }
  async getMessageByChatId(ChatId:string ):Promise<Observable<Message[]>> {
      return await this.http.get<Message[]>(`${this.apiUrl}get-by-id/${ChatId}`);
  }

   createMessage(newMessage: Message): Observable<any> {
       return this.http.post<any>(`${this.apiUrl}create`, newMessage);
     }
   
     updateMessage(updatedMessage: Message): Observable<any> {
       return this.http.put<any>(`${this.apiUrl}update/${updatedMessage.chatId}`, updatedMessage);
     }
   
     deleteMessage(messageId: string): Observable<any> {
       return this.http.delete<any>(`${this.apiUrl}delete/${messageId}`);
     }

}
