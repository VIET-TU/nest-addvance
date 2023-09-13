import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
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
  afterInit(socket: Socket) {
    console.log('socket :>> ');
  }
  async handleConnection(socket: Socket) {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && (authHeader as string).split('')[1]) {
      try {
        const email = await this.authService.handleVerifyToken(
          authHeader as string,
        );
        socket.data = email;
      } catch (error) {
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
