'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getSession } from '../actions/auth'
import { usePathname } from 'next/navigation';

const WebSocketContext = createContext();

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {

  const pathname = usePathname();

  const [messages, setMessages] = useState(null);
  const [socket, setsocket] = useState(null);
  const [sessionCookie, setSessionCookie] = useState('')

  const getSess = async () => {
    const session = await getSession();
    if (session != sessionCookie)
      setSessionCookie(session)
  }

  useEffect(() => {
    getSess();
  }, [pathname]);

  useEffect(() => {

    const setup = async () => {
      const serverUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_URL + sessionCookie.token;

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
    if (sessionCookie) {
      if (socket)
        try {
          socket.close();
        } catch (error) {

        }
      setup();
    }
    return () => {

    };
  }, [sessionCookie]);

  return (
    <WebSocketContext.Provider value={{ messages, socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};