import { io, Socket } from 'socket.io-client';
import { QueueUpdateEvent, QueueStatusEvent } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinServiceRoom(serviceId: string): void {
    if (this.socket) {
      this.socket.emit('join_service_room', serviceId);
    }
  }

  leaveServiceRoom(serviceId: string): void {
    if (this.socket) {
      this.socket.emit('leave_service_room', serviceId);
    }
  }

  joinOrgRoom(orgId: string): void {
    if (this.socket) {
      this.socket.emit('join_org_room', orgId);
    }
  }

  leaveOrgRoom(orgId: string): void {
    if (this.socket) {
      this.socket.emit('leave_org_room', orgId);
    }
  }

  onQueueUpdate(callback: (data: QueueUpdateEvent) => void): void {
    if (this.socket) {
      this.socket.on('queue:update', callback);
    }
  }

  onQueueStatusChanged(callback: (data: QueueStatusEvent) => void): void {
    if (this.socket) {
      this.socket.on('queue:statusChanged', callback);
    }
  }

  offQueueUpdate(callback: (data: QueueUpdateEvent) => void): void {
    if (this.socket) {
      this.socket.off('queue:update', callback);
    }
  }

  offQueueStatusChanged(callback: (data: QueueStatusEvent) => void): void {
    if (this.socket) {
      this.socket.off('queue:statusChanged', callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = SocketService.getInstance();
export default socketService;
