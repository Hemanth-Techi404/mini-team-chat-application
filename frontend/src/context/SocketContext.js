import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

import { SOCKET_URL } from '../config';

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      // Request current online users
      newSocket.emit('get-online-users');
    });

    newSocket.on('user-online', (data) => {
      setOnlineUsers((prev) => {
        if (!prev.find((u) => u.userId === data.userId)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    newSocket.on('user-offline', (data) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    newSocket.on('online-users', (data) => {
      setOnlineUsers(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  const value = {
    socket,
    onlineUsers
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

