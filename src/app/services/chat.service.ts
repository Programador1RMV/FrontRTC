import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chat = this.wss.fromEvent('message');
  constructor(public wss:Socket) { }
}
