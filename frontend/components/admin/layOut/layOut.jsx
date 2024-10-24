//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'
import Footer from '../layOut/footer/footer'
import Sidebaradmin from './sidebar/sidebaradmin'

const layOutComponent = ({children}) => {
  return (
    <React.Fragment>
      <Navbar />
      <div className='d-flex'>
        <div className='d-flex flex-column col-2 min-vh-100'>
          <Sidebaradmin />
        </div>  
        <div className='col-10 min-vh-100'>
          <main className="">{children}</main>
        </div>
      </div>
    </React.Fragment>
  )
}

export default layOutComponent