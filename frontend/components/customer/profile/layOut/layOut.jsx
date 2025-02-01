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
        <div style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }} > {/* เเค่เอาขนาดความสูงออกก็ทำให้เว้นระยะห่าง auto ระหว่าง navbar กับ main ได้เเล้ว */}
          <Navbar />
        </div>
        <div className="container d-flex mb-5" >
          {/* Sidebar */}
          <div className="d-none d-lg-block">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className="flex-grow-1 p-3" >
            {/* Sidebar (Mobile - Above Content) */}
            <div className="d-lg-none d-block bg-light shadow-sm mb-3" style={{ width: '100%' }}>
              <Sidebar />
            </div>
            <div className="bg-light shadow-sm mt-0" style={{ borderRadius: "8px" }}> {/* ทำให้เว้นระยะห่างระหว่าง sidebar กับ main */}
              {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default layOutComponent;