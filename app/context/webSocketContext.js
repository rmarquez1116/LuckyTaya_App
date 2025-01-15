'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileContext } from './profileContext';
import Alert from '../components/alert';

const WebSocketContext = createContext();

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const { profile } = useProfileContext();
  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState(null);
  const [alert, setAlert] = useState({
    hasTimer: false,
    timeout: 3000,
    isOpen: false,
    message: "testing",
    type: "success",
  });
  const [token, setToken] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setToken(profile.token);
    }
  }, [profile]);
  const setupWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const serverUrl = `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}${token}`;
    const socket = new WebSocket(serverUrl);

    socket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      setMessages(event.data);
    };

    socket.onerror = (error) => {
      setIsConnected(false);
      console.error('WebSocket error', error);
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket connection closed');
    };

    socketRef.current = socket;
  };

  useEffect(() => {
    if (!token) return; 

    setupWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Tab Inactive')
        if (socketRef.current) {
          socketRef.current.close();
        }
      } else {
        console.log('Tab Active')
        if (token) {
          setupWebSocket();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token]);

  useEffect(() => {
    if (messages != null) {
      try {
        const parsedMessage = JSON.parse(messages);

        switch (parsedMessage.PacketType) {
          case 22:
            setAlert({
              hasTimer: true,
              timeout: 60000,
              isOpen: true,
              type: 'info',
              message: 'Last Call !!!',
            });
            break;
          case 73:
          case 75:
            const message = JSON.parse(parsedMessage.jsonPacket);
            setAlert({
              hasTimer: false,
              timeout: message.Duration * 1000,
              isOpen: true,
              type: 'info',
              message: message.Message,
            });
            break;
          case 101:
            router.replace('/payment/success');
            break;
          case 102:
            router.replace('/payment/failed');
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message', error);
      }

      setMessages(null);
    }
  }, [messages]);

  const onCloseAlert = () => {
    setAlert({
      timeout: 3000,
      isOpen: false,
      type: '',
      message: '',
      hasTimer: false,
    });
  };

  return (
    <WebSocketContext.Provider value={{ messages, socket: socketRef.current }}>
      {alert.isOpen && (
        <Alert
          timeout={alert.timeout}
          hasTimer={alert.hasTimer}
          onClose={onCloseAlert}
          title="Lucky Taya"
          message={alert.message}
          type={alert.type}
        />
      )}
      {children}
    </WebSocketContext.Provider>
  );
};
