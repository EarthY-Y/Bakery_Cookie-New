//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'

const layOut = ({children}) => {
  return (
    <React.Fragment>
      <Navbar />
        <div class="">
          <main>{children}</main>
        </div>
    </React.Fragment>
  )
}

export default layOut