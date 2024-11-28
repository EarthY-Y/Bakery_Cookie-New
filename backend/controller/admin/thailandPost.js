import axios from 'axios';
let tokenTrackingPost = ''
const tokenTHPost = 'UvHtZ2VgGlOGPrVDQgY@IHXmSSE5IxD7P5JQWVJlQNVrE+H~EZNCP@KdYjCRSAPvOGISYoTDV!UNI#W!OTHeDnWWF.YYNLToQVT2'
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
    return response.data; // หรือ return JSON.stringify(response.data) หากต้องการส่งคืนในรูปแบบ string
  } catch (error) {
    console.error("Error getTokenPostTH:", error);
    throw error; // หากต้องการให้ข้อผิดพลาดถูกโยนกลับไปยังตัวเรียกใช้งาน
  }
};

import axios from 'axios';

export const getTracking = async () => {
  const API_URL = 'https://trackapi.thailandpost.co.th/post/api/v1/track';

  try {
    const data = {
      status: "all",
      language: "TH",
      barcode: ["EB663471002TH"]
    };

    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' // ใส่ Token ที่ถูกต้องที่นี่
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
