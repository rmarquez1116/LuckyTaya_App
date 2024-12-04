'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getSession } from '../actions/auth'
import { usePathname, useRouter } from 'next/navigation';
import Alert from '../components/alert';

const WebSocketContext = createContext();

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [messages, setMessages] = useState(null);
  const [socket, setsocket] = useState(null);
  const [sessionCookie, setSessionCookie] = useState('')
  const [closeBet, setCloseBet] = useState(false)  
  const [alert, setAlert] = useState({hasTimer : false, timeout: 3000, isOpen: false, message: "testing", type: "success" })

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
  const onCloseAlert = (hasTimer) => {
    setAlert({ timeout: 3000, isOpen: false, type: "", message: "",hasTimer : false, })
    setCloseBet(true)
  }

  useEffect(() => {

    try {
      if (messages != null) {
        const parseMessage = JSON.parse(messages)
        switch (parseMessage.PacketType) {
          case 22:
            setAlert({hasTimer : true, timeout: 60000, isOpen: true, type: "info", message: "Last Call !!!" })
            break;
          case 73:
          case 75:
            const message = JSON.parse(parseMessage.jsonPacket)
            setAlert({hasTimer : false, timeout: message.Duration * 1000, isOpen: true, type: "info", message: message.Message })

            break;
          case 101:
            router.replace('/payment/success')
            break;
          case 102:
            router.replace('/payment/failed')
            break;
          default:
            break;
        }

      }
    } catch (error) {

    }
  }, [messages])
  return (
    <WebSocketContext.Provider value={{ messages, socket ,closeBet}}>
      {alert.isOpen && <Alert timeout={alert.timeout} hasTimer={alert.hasTimer} onClose={onCloseAlert} title="Lucky Taya" message={alert.message} type={alert.type}></Alert>}
      {children}
    </WebSocketContext.Provider>
  );
};