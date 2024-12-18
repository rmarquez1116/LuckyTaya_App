'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSession } from '../actions/auth';
import { usePathname, useRouter } from 'next/navigation';
import Alert from '../components/alert';
import { useProfileContext } from './profileContext';
import { isJsonEmpty } from '@app/lib/utils';

const WebSocketContext = createContext();

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const { profile } = useProfileContext();
  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState(null);
  const [closeBet, setCloseBet] = useState(false);
  const [alert, setAlert] = useState({
    hasTimer: false,
    timeout: 3000,
    isOpen: false,
    message: "testing",
    type: "success",
  });

  const socketRef = useRef(null); // Ref to persist the WebSocket across renders

  useEffect(() => {
    if (isJsonEmpty(profile)) return; // Don't attempt to connect if profile is empty

    const setupWebSocket = () => {
      // Check if there's already a socket connection
      if (socketRef.current) {
        socketRef.current.close(); // Close any existing connection
      }

      const serverUrl = `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}${profile.token}`;
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

    // Setup WebSocket connection when profile is available
    setupWebSocket();

    // Cleanup WebSocket connection when component unmounts or profile changes
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [profile]); // Effect runs only when `profile` changes

  const onCloseAlert = (hasTimer) => {
    setAlert({
      timeout: 3000,
      isOpen: false,
      type: '',
      message: '',
      hasTimer: false,
    });
    setCloseBet(true);
  };

  useEffect(() => {
    // Process WebSocket messages and set alerts accordingly
    try {
      if (messages != null) {
        const parseMessage = JSON.parse(messages);
        switch (parseMessage.PacketType) {
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
            const message = JSON.parse(parseMessage.jsonPacket);
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
        setMessages(null)
      }
    } catch (error) {
      console.error('Error processing WebSocket message', error);
    }
  }, [messages]); // Runs when new messages are received

  return (
    <WebSocketContext.Provider value={{ messages, socket: socketRef.current, closeBet }}>
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
