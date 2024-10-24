//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'
import Footer from '../layOut/footer/footer'
import Sidebaradmin from './sidebar/sidebaradmin'

const layOutComponent = ({children}) => {
  return (
    <React.Fragment>
      <Navbar />
        <div >
        <Sidebaradmin/>
          <main className="d-flex flex-column min-vh-100">{children}</main>
        </div>
        <Footer/>
    </React.Fragment>
  )
}

export default layOutComponent