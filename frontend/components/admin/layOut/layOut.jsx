//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'
import Footer from '../layOut/footer/footer'
import Sidebaradmin from './sidebar/sidebaradmin'

const layOutComponent = ({children}) => {
  return (
    <React.Fragment>
      {/* Navbar ที่จะเลื่อนตามด้านบน */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Navbar />
      </div>

      {/* โครงสร้างหลักของหน้า */}
      <div className="d-flex">
        {/* Sidebar ที่ไม่เลื่อนตาม */}
        <div
          className="d-flex flex-column col-2 min-vh-100"
          style={{
            position: 'fixed',
            left: 0,
            height: '100vh',
            zIndex: 1000, // เพื่อให้ sidebar อยู่ด้านบนของ content อื่นถ้าทับกัน
          }}
        >
          <Sidebaradmin />
        </div>  

        {/* Main content ที่จะเลื่อนตามปกติ */}
        <div className="col-10 offset-2 min-vh-100">
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  )
}

export default layOutComponent