//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'
import Footer from '../layOut/footer/footer'
import Sidebaradmin from './sidebar/sidebaradmin'
import { useState, useEffect } from 'react';

const layOutComponent = ({children}) => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  //ทถ้าหน้าจอเล็กกว่า 992px ให้เป็น true ถ้าไม่ให้เป็น false คือ sidebar จะไม่แสดง
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
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
        <div className={`${window.innerWidth >= 992 ? 'col-10 offset-2 d-lg-block' : 'col-12 d-lg-none'}`}>
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}

export default layOutComponent