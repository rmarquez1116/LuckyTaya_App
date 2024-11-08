
import { useEffect, useState } from 'react';
import { getSession } from '../actions/auth';

const useSocket = () => {

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const setup = async () => {
      const session = await getSession();
      const serverUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_URL + session.token;
      const socket = new WebSocket(serverUrl);

      socket.onmessage = (event) => {
        setMessages(event.data);
        // console.log(event.data, 'hello message');
      };

      // Handle WebSocket connection open event
      socket.onopen = () => {
        console.log('WebSocket connected');
      };

      // Handle WebSocket connection close event
      socket.onclose = () => {
      };


      setSocket(socket);
    }

    setup();

    // Cleanup on unmount
    return () => {
      try {
        socket.disconnect();
      } catch (error) {

      }
    };
  }, []);

  return { socket, messages };
};

export default useSocket;