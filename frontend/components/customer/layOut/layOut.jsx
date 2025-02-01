import React, { useState, useEffect } from 'react';
import Navbar from './navbar/navbar';
import Footer from '../layOut/footer/footer';
import { CartProvider } from './navbar/CartContext';

const LayoutComponent = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <React.Fragment>
        <div style={{ backgroundColor: '#FFF2E1', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Navbar */}
          <CartProvider>
            <div style={{ position: 'fixed', top: 0, zIndex: 1000, width: '100%', height: '65px' }}>
              <Navbar />
            </div>

            {/* Main Content */}
            <div className="flex-grow-1" style={{ paddingTop: isDesktop ? '355px' : '105px' }}>
              <main className="container">{children}</main>
            </div>
          </CartProvider>
        {/* Footer */}
        <div style={{ backgroundColor: '#C40C0C' }}>
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
};

export default LayoutComponent;
