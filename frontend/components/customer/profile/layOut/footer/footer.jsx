import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="text-white py-5 d-flex align-items-end flex-column" style={{ backgroundColor: '#C40C0C'}}>
      <div className="container col-12 text-start mt-auto p-2 ">
        <h5>About</h5>
        <p>เบเกอร์รี่แอนด์คุกกี้ ร้านเบเกอรี่เล็กๆ ใจกลางรามอินทรา 101 โดดเด่นด้วยขนมอบสดใหม่ที่ทำตามออร์เดอร์ทุกชิ้น ไม่ว่าจะเป็นเค้ก ขนมปัง หรือคุกกี้ รับประกันความสดใหม่และรสชาติที่ใส่ใจในทุกขั้นตอน 
          พร้อมเสิร์ฟความอร่อยให้กับทุกโอกาสพิเศษของคุณ!</p>
        <h5>Contact</h5>
        <p>Tel: 0891175751 <br />Line official account: @421qvgwl</p>
      </div>
    </footer>
  );
};

export default Footer;