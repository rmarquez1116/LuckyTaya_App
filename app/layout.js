import React from 'react'
import "./globals.css";
import Head from 'next/head';

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                {/* Add Open Sans Font from Google Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    )
}
