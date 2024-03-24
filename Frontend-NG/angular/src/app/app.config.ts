import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const socketIoConfig: SocketIoConfig = { url: 'http://localhost:4500', options: {} };

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), DatePipe,
    importProvidersFrom(SocketIoModule.forRoot(socketIoConfig)) ]
};
