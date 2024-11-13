import React from 'react'
import "./globals.css";
import {WebSocketProvider} from './context/webSocketContext'

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <WebSocketProvider>

                    {children}
                </WebSocketProvider>
            </body>
        </html>
    )
}
