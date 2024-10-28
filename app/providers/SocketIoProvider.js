'use client'
import SocketIoClient from "../lib/socket-client"
import React, { createContext, useRef, useState } from "react"

export const socketIoContext = createContext({
  socketIoClient: null,
  connected: false
})

export function ProvideSocketIoClient({ children }) {
  const socketIo = useProvideSocketIoClient()
  return (
    <socketIoContext.Provider
      value={{
        socketIoClient: socketIo?.client || null,
        connected: socketIo?.connected || false
      }}
    >
      {children}
    </socketIoContext.Provider>
  )
}
function useProvideSocketIoClient() {
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)
  if (typeof window === "undefined") return
  const url = process.env.NEXT_PUBLIC_BASE_URL || ""
  const config = {
    url: url,
    token: ""
  }

  if (!clientRef.current) {
    clientRef.current = new SocketIoClient(config)
    clientRef.current.on("connect", () => {
      setConnected(true)
      console.log("Socket.io client connected")
    })
    clientRef.current.on("disconnect", () => {
      setConnected(false)
      console.log("Socket.io client disconnected")
    })
  }
  return { client: clientRef.current, connected } // Return the existing instance if it exists
}
