import React, { useEffect, useState } from 'react';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE
const lineOA = () => {
  return(
    <div className="container text-center mt-5">
      <h3>สามารถสเเกน QR Code เพื่อติดต่อสอบถามกับทางร้านได้โดยตรงเลย</h3>
      <img src="https://qr-official.line.me/gs/M_421qvgwl_BW.png?oat_content=qr" />
    </div>
  );
};

export default lineOA;
