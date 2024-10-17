import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="text-white py-5 mt-auto" style={{ backgroundColor: '#C40C0C'}}>
      <div className="container text-center">
        <h5>About</h5>
        <p>ร้านโฮมเมดเบเกอร์รี่แอนด์คุกกี้ เป็นร้านขายขนมที่ผลิตสดใหม่ทุกวัน</p>
        <h5>Contact</h5>
        <p>Tel: 089 xxx xxxx<br />Facebook: <br />Line: </p>
      </div>
    </footer>
  );
};

export default Footer;