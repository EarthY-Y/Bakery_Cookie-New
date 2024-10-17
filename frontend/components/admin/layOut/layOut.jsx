//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'
import Footer from '../layOut/footer/footer'

const layOutComponent = ({children}) => {
  return (
    <React.Fragment>
      <Navbar />
        <div >
          <main className="d-flex flex-column min-vh-100">{children}</main>
        </div>
        <Footer/>
    </React.Fragment>
  )
}

export default layOutComponent