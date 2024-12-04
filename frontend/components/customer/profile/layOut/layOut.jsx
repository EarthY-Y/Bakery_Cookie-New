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
        <div style={{ position: 'sticky', top: 0, zIndex: 1000, height: '65px', width: '100%'}} >
        <Navbar />
        </div>
        <div className="container d-flex mb-5" style={{ minHeight: '80vh'}}>
          {/* Sidebar */}
          <div style={{ width: '250px' }}>
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className="flex-grow-1 p-3 ms-2 bg-white">
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