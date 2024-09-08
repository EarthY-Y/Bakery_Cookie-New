//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'

const layOutComponent = ({children}) => {
  return (
    <React.Fragment>
      <Navbar />
        <div className="">
          <main>{children}</main>
        </div>
    </React.Fragment>
  )
}

export default layOutComponent