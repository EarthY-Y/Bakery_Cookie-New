import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // โหลดไฟล์ .env
let tokenPostManAPI = null; // ประกาศตัวแปร global เพื่อเก็บ Token
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
    tokenPostManAPI = response.data.token
    // console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getTracking = async (req, res) => {
  const id = req.params.id;
  // console.log("ID:", id);
  console.log('tokenPostManAPI',tokenPostManAPI);
  
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

    // console.log('response getTracking' , JSON.stringify(response.data));
    return res.status(200).json(response.data); // หรือ JSON.stringify(response.data) หากต้องการส่งคืนในรูปแบบ string
  } catch (error) {
    console.error("Error getTracking:", error);
    return res.status(500).json({ 
      message: "เกิดข้อผิดพลาดในการติดตามพัสดุ", 
      error 
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
