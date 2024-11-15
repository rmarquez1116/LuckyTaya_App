'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getSession } from '../actions/auth'

const WebSocketContext = createContext();

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState(null);
  const [socket, setsocket] = useState(null);

  useEffect(() => {
    const setup = async () => {
      const session = await getSession();
      const serverUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_URL + session.token;
      if(!session)return;
      const socket = new WebSocket(serverUrl);

      socket.onmessage = (event) => {
        setMessages(event.data);
      };

      socket.onopen = () => {
        console.log('WebSocket connected');
      };

      socket.onerror = (error) => {
        console.error('WebSocket error', error);
      };

      setsocket(socket);

    }
    setup();
    return () => {
      try {
      socket.close();
      } catch (error) {

      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ messages, socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};