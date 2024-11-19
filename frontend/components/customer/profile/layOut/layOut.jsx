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
        <Navbar />
        
        <div className="container d-flex" style={{ minHeight: '100vh' }}>
          {/* Sidebar */}
          <div style={{ width: '250px' }}>
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className="flex-grow-1 p-3">
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