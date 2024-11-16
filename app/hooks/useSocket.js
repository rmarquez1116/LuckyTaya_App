
import { useEffect, useState } from 'react';
import { getSession } from '../actions/auth';

const useSocket = (onMessageReceived) => {

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(null);
  const [url, setUrl] = useState(null)
  const [sessionCookie, setSessionCookie] = useState('')

  useEffect(() => {
  }, [socket, messages])
  const gettingSession = async () => {
    const serverUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_URL + session.token;
    setUrl(serverUrl)
  }
  useEffect(() => {
    const gettingSess = async () => {
      const session = await getSession();
      setSessionCookie(session)
    }
    gettingSess();
  }, [])

  useEffect(() => {
    console.log(sessionCookie, 'session-------------')
    if (sessionCookie)
      gettingSession();
  }, [sessionCookie])


  useEffect(() => {
    const setup = async () => {

      console.log(sessionCookie, 'session[-------------')
      const socket = new WebSocket(url);
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
        console.log('WebSocket Close');
      };


      setSocket(socket);
    }
    
    console.log({sessionCookie,url}, 'session[-------------')
    if (url)
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
  }, [url, sessionCookie]);
  return { socket, messages };
};

export default useSocket;