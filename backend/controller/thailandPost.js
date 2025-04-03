import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // โหลดไฟล์ .env

//สรุปปัญหาที่เจอคือมีไฟล์ที่ frontend ที่ใช้เรียกใช้่งาน Fuction getTracking() โดยตรงเลยติดปัญหาตรงที่วคำสั่ง process.env เป็นของ backend frontend ไม่สามารถใช้ได้

const POSTTOKEN = process.env.POSTTOKEN;

export const getTokenPostTH = async () => {
  const API_URL = 'https://trackwebhook.thailandpost.co.th/post/api/v1/authenticate/token';
  try {
    const response = await axios.post(API_URL, {}, {
      headers: { 
        'Authorization': `Token ${POSTTOKEN}`,  
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getTracking = async (id) => {
  const API_URL = 'https://trackapi.thailandpost.co.th/post/api/v1/track';
  try {
    const data = {
      status: "all",
      language: "TH",
      barcode: [`${id}`]
    };

    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + tokenPostManAPI // ใส่ Token ที่ถูกต้องที่นี่
      },
      maxBodyLength: Infinity
    });

    console.log(JSON.stringify(response.data));
    return response.data; // หรือ JSON.stringify(response.data) หากต้องการส่งคืนในรูปแบบ string
  } catch (error) {
    console.error("Error getTracking:", error);
    throw error; // หากต้องการโยนข้อผิดพลาดกลับไป
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
