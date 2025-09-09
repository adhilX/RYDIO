import { io, Socket } from 'socket.io-client';
import type { Imessage } from '../Types/chat/Imessage';

export interface SocketMessage {
  chatId: string;
  messageContent: string;
  senderId: string;
  receiverId: string;
  senderModel: 'user' | 'owner';
}

export interface SocketResponse {
  success: boolean;
  message?: Imessage;
  error?: string;
}

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private isConnected = false;

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(serverUrl: string = 'http://localhost:3000'): void {
    if (this.socket?.connected) return;

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  registerUser(userId: string, name: string, role: 'user' | 'owner'): void {
    if (this.socket?.connected) {
      this.socket.emit('registerUser', { userId, name, role });
    }
  }

  sendMessage(messageData: SocketMessage): Promise<SocketResponse> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }

      this.socket.emit('sendMessage', messageData, (response: SocketResponse) => {
        resolve(response);
      });
    });
  }

  onMessageReceived(callback: (message: Imessage) => void): void {
    if (this.socket) {
      this.socket.on('receiveMessage', callback);
    }
  }

  onMessageSent(callback: (message: Imessage) => void): void {
    if (this.socket) {
      this.socket.on('messageSent', callback);
    }
  }

  offMessageReceived(): void {
    if (this.socket) {
      this.socket.off('receiveMessage');
    }
  }

  offMessageSent(): void {
    if (this.socket) {
      this.socket.off('messageSent');
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }
}
