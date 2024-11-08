import React from 'react';
import { createContext, useContext } from 'react';
import useSocket from '../hooks/useSocket';
import { useEffect } from 'react';

// Create a context with a default value
const WebSocketContext = createContext();

// Custom provider component
export const WebSocketContextProvider = ({ children }) => {
  const { socket, messages } = useSocket();

  return (
    <WebSocketContext.Provider value={{messages}}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the context
export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};