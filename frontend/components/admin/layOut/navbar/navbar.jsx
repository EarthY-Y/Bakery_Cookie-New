import React from 'react';
import { Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logoeiei from '../../../../src/assets/Logoeiei.png'

function Navbaradmin() {
  return (
    <div className="p-1 mb-2 text-dark" style={{ backgroundColor: '#347928', width: '100%', height: '60px' }}>
        <img className='mt-auto mb-auto ms-3'
          src={Logoeiei} // เปลี่ยน URL เป็นโลโก้ของคุณ
          style={{ width: 'auto', height: '100%' }}
        />
    </div> 
  )
}

export default Navbaradmin;