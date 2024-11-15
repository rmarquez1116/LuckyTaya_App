import React, { Suspense } from "react"
import Loading from "../components/loading"

export const metadata = {
  title: 'Lucky Taya',
  description: 'Lucky Taya',
}

export default function RootLayout({ children }) {
  return (

    <React.Fragment>
      <Suspense fallback={<Loading></Loading>}>

      {children}
      </Suspense>
    </React.Fragment>
  )
}
