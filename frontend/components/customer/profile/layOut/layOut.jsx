//rafce shortKey
import React, { useState, useEffect } from 'react';
import Navbar from './navbar/navbar'
import Sidebar from './sidebar/sidebar'
import Footer from '../layOut/footer/footer'

const layOutComponent = React.memo(({ children }) => {
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
      <div style={{ backgroundColor: '#FFF2E1' }}>
        <div style={{ position: 'fixed', top: 0, zIndex: 1000, width: '100%' }}>
          <Navbar />
        </div>
        <div className="container d-flex mb-5" style={{ paddingTop: isDesktop ? '355px' : '105px' }}>
          <div className="d-none d-lg-block">
            <Sidebar />
          </div>
          <div className="flex-grow-1 p-3" style={{ overflow: 'auto' }}>
            <div className="d-lg-none d-block bg-light shadow-sm mb-3" style={{ width: '100%' }}>
              <Sidebar />
            </div>
            <div className="bg-light shadow-sm mt-0 pt-3 pb-3" style={{ borderRadius: "8px", minHeight: '50vh' }}>
              <main className="d-flex flex-column">{children}</main>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
});

export default layOutComponent;