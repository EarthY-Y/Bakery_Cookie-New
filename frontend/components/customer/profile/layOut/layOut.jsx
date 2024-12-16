//rafce shortKey
import React from 'react'
import Navbar from './navbar/navbar'
import Sidebar from './sidebar/sidebar'
import Footer from '../layOut/footer/footer'

const layOutComponent = ({ children }) => {
  return (
    <React.Fragment>
      <div style={{ backgroundColor: '#FFF2E1' }}>
        {/* Navbar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', }} > {/* เเค่เอาขนาดความสูงออกก็ทำให้เว้นระยะห่าง auto ระหว่าง navbar กับ main ได้เเล้ว */}
        <Navbar />
        </div>
        <div className="container d-flex mb-5" style={{ minHeight: '80vh'}}>
          {/* Sidebar */}
          <div className="d-none d-lg-block">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className="flex-grow-1 p-3 bg-white mt-3" >
            {/* Sidebar (Mobile - Above Content) */}
            <div className="d-lg-none d-block mb-3 w-5">
              <Sidebar />
            </div>
            {children}
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default layOutComponent;