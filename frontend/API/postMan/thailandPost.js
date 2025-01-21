import axios from 'axios';

const tokenTHPost = 'TTEeFIKIJQF8YPZEP*NrX7WxMxJAWQBQAXZ3LfF-APF7FVJ-VMIHHhBXHbMHX4EiOKV#R_T3VjYSS:CjYVWbD*N_NETmAvE;JQCf';

export const getTokenPostTH = async () => {
  const API_URL = 'https://trackwebhook.thailandpost.co.th/post/api/v1/authenticate/token';

  try {
    const response = await axios.post(API_URL, {}, {
      headers: { 
        'Authorization': `Token ${tokenTHPost}`,  
        'Content-Type': 'application/json'
      }
    });
    
    console.log(JSON.stringify(response.data));
    localStorage.setItem('tokenPostManAPI' , response.data.token) // หรือ return JSON.stringify(response.data) หากต้องการส่งคืนในรูปแบบ string

    const { token, expires_in } = response.data;
    // คำนวณเวลาหมดอายุ
    const expirationTime = Date.now() + expires_in * 1000; // expires_in เป็นวินาที
    localStorage.setItem('TOKEN_KEY', token);
    localStorage.setItem('EXPIRATION_KEY', expirationTime.toString());

  } catch (error) {
    console.error("Error getTokenPostTH:", error);
    throw error; // หากต้องการให้ข้อผิดพลาดถูกโยนกลับไปยังตัวเรียกใช้งาน
  }
};

export const getTracking = async (id) => {
  const API_URL = 'https://trackapi.thailandpost.co.th/post/api/v1/track';
  let tokenPostManAPI = localStorage.getItem('tokenPostManAPI');
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

export const validateTokenPostTH = async () => {
  const storedToken = localStorage.getItem('TOKEN_KEY');
  const storedExpiration = localStorage.getItem('EXPIRATION_KEY');

  // ตรวจสอบว่า Token และเวลาหมดอายุถูกเก็บไว้หรือไม่
  if (storedToken && storedExpiration) {
    const expirationTime = parseInt(storedExpiration, 10);

    // หาก Token ยังไม่หมดอายุ
    if (Date.now() < expirationTime) {
      return storedToken;
    }
  }

  // หาก Token หมดอายุหรือไม่มี ให้สร้างใหม่
  return await getTokenPostTH();
};
