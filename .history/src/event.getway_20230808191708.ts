import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { AuthService } from './user/services/auth.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventGeteway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly authService: AuthService) {}

  handleEmitSocket({ data, event, to }) {
    if (to) {
      // this.server.to(to.map((el) => String(el))).emit(event, data);
      this.server.to(to).emit(event, data);
    } else {
      this.server.emit(event, data);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(socket: Socket, @MessageBody() data) {
    console.log('message', data, socket.id);
    setTimeout(() => {
      this.server.to(socket.data.email + '1').emit('message', data);
    }, 1000);
  }

  afterInit(socket: Socket) {
    return null;
  }
  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && (authHeader as string).split(' ')[1]) {
      try {
        socket.data.email = await this.authService.handleVerifyToken(
          (authHeader as string).split(' ')[1],
        );
        socket.join(socket.data.email);
        console.log('connect success', socket.data.email);
      } catch (e) {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }
  handleDisconnect(socket: Socket) {
    console.log(socket.id, socket.data);
  }
}
