import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // โหลดไฟล์ .env

//สรุปปัญหาที่เจอคือมีไฟล์ที่ frontend ที่ใช้เรียกใช้่งาน Fuction getTracking() โดยตรง เลยติดปัญหาตรงที่คำสั่ง process.env เป็นของ backend frontend ไม่สามารถใช้ได้
const POSTTOKEN = process.env.POSTTOKEN;

// ฟังก์ชันเพื่อดึง token จาก Thailand Post API
export const getTokenPostTH = async () => {
  const API_URL = 'https://trackwebhook.thailandpost.co.th/post/api/v1/authenticate/token';
  try {
    // ส่งคำขอเพื่อดึง Token ใหม่
    const response = await axios.post(API_URL, {}, {
      headers: {
        'Authorization': `Token ${POSTTOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    // คืนค่า token ที่ได้รับจาก API
    return response.data.token;
  } catch (error) {
    console.error('Error in getTokenPostTH:', error);
    throw new Error('ไม่สามารถดึง Token ได้');
  }
};

// ฟังก์ชันเพื่อดึงข้อมูลการติดตามพัสดุจาก API ของไปรษณีย์ไทย
export const getTracking = async (req, res) => {
  const id = req.params.id; // รับรหัสพัสดุจาก URL params
  let tokenPostManAPI = null;

  if (!tokenPostManAPI) {
    // ถ้าไม่มี token ให้เรียกฟังก์ชัน getTokenPostTH เพื่อดึง Token ใหม่
    const resTokent = await getTokenPostTH();
    tokenPostManAPI = resTokent;
  }

  const API_URL = 'https://trackapi.thailandpost.co.th/post/api/v1/track';

  try {
    // ข้อมูลที่ต้องการส่งไปยัง API
    const data = {
      status: 'all',
      language: 'TH',
      barcode: [`${id}`], // ใส่รหัสพัสดุที่ต้องการติดตาม
    };

    // ส่งคำขอไปยัง API ของไปรษณีย์ไทย
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${tokenPostManAPI}`,
      },
      maxBodyLength: Infinity, // ใช้สำหรับกรณีที่ข้อมูลมีขนาดใหญ่
    });

    // ส่งข้อมูลการติดตามกลับไปยัง frontend
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in getTracking:', error);
    return res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการติดตามพัสดุ',
      error,
    });
  }
};


// export const validateTokenPostTH = async () => {
//   const storedToken = localStorage.getItem('TOKEN_KEY');
//   const storedExpiration = localStorage.getItem('EXPIRATION_KEY');

//   // ตรวจสอบว่า Token และเวลาหมดอายุถูกเก็บไว้หรือไม่
//   if (storedToken && storedExpiration) {
//     const expirationTime = parseInt(storedExpiration, 10);

//     // หาก Token ยังไม่หมดอายุ
//     if (Date.now() < expirationTime) {
//       return storedToken;
//     }
//   }

//   // หาก Token หมดอายุหรือไม่มี ให้สร้างใหม่
//   return await getTokenPostTH();
// };
