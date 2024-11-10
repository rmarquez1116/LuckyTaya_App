
import { useEffect, useState } from 'react';
import { getSession } from '../actions/auth';

const useSocket = () => {

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(null);
  useEffect(() => {
  }, [socket,messages])
 

  useEffect(() => {
    const setup = async () => {
      const session = await getSession();
      const serverUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_URL + session.token;
      const socket = new WebSocket(serverUrl);
      socket.onmessage = (event) => {
        setMessages(event.data);
        console.log(event.data, 'hello message');
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
    const intervalId = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send('ping'); // You can send any message to keep it alive
      }
    }, 30000); // Send ping every 30 seconds (adjust as needed)

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      try {
        socket.disconnect();
      } catch (error) {

      }
    };
  }, []);
  return { socket, messages };
};

export default useSocket;