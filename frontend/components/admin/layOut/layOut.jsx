//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'
import Footer from '../layOut/footer/footer'
import Sidebaradmin from './sidebar/sidebaradmin'

const layOutComponent = ({children}) => {
  return (
    <React.Fragment>
      {/* Navbar ที่จะเลื่อนตามด้านบน */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#347928', height: '65px', width: '100%'}} >
        <Navbar />
      </div>

      {/* โครงสร้างหลักของหน้า */}
      <div className="d-flex min-vh-100">
        {/* Sidebar ที่ไม่เลื่อนตาม */}
        <div className="d-lg-block d-none"style={{  position: 'fixed',  left: 0,  height: '100vh',  zIndex: 1000,}}>
          <Sidebaradmin />
        </div>  

        {/* Main content ที่จะเลื่อนตามปกติ */}
        <div className="col-10 offset-2 d-none d-lg-block min-vh-100">
          <main>{children}</main>
        </div>

        {/* Main content ที่จะเลื่อนตามปกติ */}
        <div className="col-12 d-lg-none min-vh-100">
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  )
}

export default layOutComponent