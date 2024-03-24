import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  constructor(private socket: Socket) {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('message', (data: any) => {
      console.log('Received message:', data);
    });
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  notifyOnline(email: string) {
    this.socket.emit('userOnline', { email });
  }

  listenForMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }
}