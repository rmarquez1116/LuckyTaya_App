import React from 'react'
import "./globals.css";
import { WebSocketProvider } from './context/webSocketContext'
import { ProfileProvider } from './context/profileContext';

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className='bg-background'>
                <ProfileProvider>
                    <WebSocketProvider>
                        {children}
                    </WebSocketProvider>
                </ProfileProvider>
            </body>
        </html>
    )
}
