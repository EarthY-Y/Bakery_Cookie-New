//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'
import Footer from '../layOut/footer/footer'
import { CartProvider } from './navbar/CartContext';

const layOutComponent = ({children}) => {
  return (
    <React.Fragment>
      <CartProvider>
        <div style={{ backgroundColor: '#FFF2E1'}}>
          <div style={{ position: 'sticky', top: 0, zIndex: 1000, height: '65px', width: '100%'}}>
            <Navbar />
          </div>
          <div >
            <main className="d-flex flex-column min-vh-100" style={{ paddingTop: '150px' }}>{children}</main>
          </div>
        </div>
      </CartProvider>
      <div  style={{ backgroundColor: '#C40C0C'}}>
        <Footer/>
      </div>
    </React.Fragment>
  )
}

export default layOutComponent