import React from "react"

export const metadata = {
  title: 'Lucky Taya',
  description: 'Lucky Taya',
}

export default function RootLayout({ children }) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}
