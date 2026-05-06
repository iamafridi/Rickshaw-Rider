import { io, Socket } from 'socket.io-client';
import { ENV } from '@/constants/env';
import { secureStorage } from './storage';

let socket: Socket | null = null;

export const initSocket = async () => {
  if (socket) return socket;
  
  const token = await secureStorage.getAccessToken();
  socket = io(ENV.SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
  });

  return socket;
};

export const getSocket = () => socket;
