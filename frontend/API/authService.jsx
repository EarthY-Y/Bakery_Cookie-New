import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import LoadingPopup from '../components/untils/popUp/loading';
import liff from '@line/liff'
import { getTokenPostTH } from './postMan/thailandPost';

const API_URL = import.meta.env.VITE_API_Port
const API_LINE_LOGIN = import.meta.env.VITE_LINE_LOGIN

//ระบบ login
export const login = async (userName, passWord) => {
  try {
    const tokenPostManAPI = localStorage.getItem('tokenPostManAPI');
    if (!tokenPostManAPI) {
      await getTokenPostTH()
    }
    const res = await axios.post(API_URL+'/login', { userName, passWord });
    console.log(res);
    return res;
  } catch (error) {
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
};

export const loginLINE = async (profile) => {
  try {
    const res = await axios.post(API_URL+'/login-line/customer', {profile});
    console.log(res);
    return res;
  } catch (error) {
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
};

export const logout = async () => {
  try {
    removeToken()
  } catch (error) {
    console.error("Error logout:", error);
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
};

export const logoutAdmin = async () => {
  try {
    removeTokenAdmin()
  } catch (error) {
    console.error("Error logout:", error);
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
};

//authRouth //*การใช้ export จะถูกนำไปใช้กับ component เท่านั้นเรียกเอามาใช้เหมือน Function ปกติไม่ได้เพราะต้องมีการเรนเดอร์เพราะติดเรื่อง React Hook (useState, useEffect)
export const ProtectedRouteAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('tokenAdmin');
  const tokenPostManAPI = localStorage.getItem('tokenPostManAPI');
  const navigate = useNavigate()

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log("No token found. Redirecting to login...");
        setLoading(false);
        autoRemoveTokenAdmin(token)
        return;
      }
      try {
        console.log("Verifying token...");
        const resAdmin = await axios.get(API_URL+'/verifyAdmin', {
          headers: {
            'authorization': `Bearer ${token}`
          }
        });
        console.log('Response from verifyAdmin:', resAdmin.data);
        
        if (resAdmin.data.results && resAdmin.data.results.length !== 0) {
          if(!tokenPostManAPI){
            getTokenPostTH()
          }
          setIsAdmin(true);
        } else {
          console.log("User is not an admin. Redirecting to login...");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error during token verification:', error);
        setIsAdmin(false); 
      } finally {
        setLoading(false); 
      }
    };
    verifyToken();
  }, [token]); //เมื่อ token มีการเปลี่ยนเเปลงก็จะมีการทำงานของ useEffect อีกครั้ง

  if (loading) {
    return LoadingPopup(loading);
  }

  if (!token || !isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;//จะเเสดง Route ลูกที่ Function นี้ครอบไว้ใน App.jsx
};

export const ProtectedRouteCustomer = () => {
  const [loading, setLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const token = localStorage.getItem('token');
  const tokenPostManAPI = localStorage.getItem('tokenPostManAPI');
  const navigate = useNavigate()

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log("No token found. Redirecting to login...");
        setLoading(false);
        autoRemoveToken(token)
        return;
      }else {
        autoRemoveToken(token)
        try {
          console.log("Verifying token...");
          const resCustomer = await axios.get(API_URL+'/verifyCustomer', {
            headers: {
              'authorization': `Bearer ${token}`
            }
          });
          console.log('Response from verifyCustomer:', resCustomer.data);

          if (resCustomer.data.results && resCustomer.data.results.length !== 0) {
            if(!tokenPostManAPI){
              getTokenPostTH()
            } 
            setIsCustomer(true);
          } else {
            console.log("User is not an customer. Redirecting to login...");
            setIsCustomer(false);
          }
        } catch (error) {
          console.error('Error during token verification:', error);
          setIsCustomer(false); 
          return;
        } finally {
          setLoading(false); 
        }
      }
    };
    verifyToken();
  }, [token]);

  if (loading) {
    return LoadingPopup(loading);
  }

  if (!token || !isCustomer) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export const CheckRouteCustomer = () => {
  const [loading, setLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const navigate = useNavigate()
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log("No token found. Redirecting to login...");
        setLoading(false);
        location.reload();
        autoRemoveToken(token)
        return;
      }else {
        autoRemoveToken(token)
        try {
          console.log("Verifying token...");
          const resCustomer = await axios.get(API_URL+'/verifyCustomer', {
            headers: {
              'authorization': `Bearer ${token}`
            }
          });
          console.log('Response from verifyCustomer:', resCustomer.data);

          if (resCustomer.data.results && resCustomer.data.results.length !== 0) {
            setIsCustomer(true);
            return navigate("/home");
          } else {
            console.log("User is not an customer. Redirecting to login...");
            setIsCustomer(false);
          }
        } catch (error) {
          console.error('Error during token verification:', error);
          setIsCustomer(false); 
          return;
        } finally {
          setLoading(false); 
        }
      }
    }
    verifyToken();
  },[token])
  if (loading) {
    return LoadingPopup(loading);
  }

  return <Outlet />;
};

export const CheckRouteAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate()
  const token = localStorage.getItem('tokenAdmin');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log("No token found. Redirecting to login...");
        setLoading(false);
        location.reload();
        autoRemoveTokenAdmin(token)
        return;
      }
      try {
        autoRemoveTokenAdmin(token)
        console.log("Verifying token...");
        const resAdmin = await axios.get(API_URL+'/verifyAdmin', {
          headers: {
            'authorization': `Bearer ${token}`
          }
        });
        console.log('Response from verifyAdmin:', resAdmin.data);
        
        if (resAdmin.data.results && resAdmin.data.results.length !== 0) {
          setIsAdmin(true);
          return navigate("/dashboard")
        } else {
          console.log("User is not an admin. Redirecting to login...");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error during token verification:', error);
        setIsAdmin(false); 
      } finally {
        setLoading(false); 
      }
    }
    verifyToken();
  },[token])

  if (loading) {
    return LoadingPopup(loading);
  }

  return <Outlet />; //ถ้าทุกอย่างถูกต้อง เเล้วจะเเสดง Route ลูกที่ Function นี้ครอบไว้ใน App.jsx
};


// ฟังก์ชันในการลบ token
function removeToken() {
  localStorage.removeItem('token'); // ลบ token ออกจาก Local Storage
  localStorage.removeItem('TOKEN_KEY');
  localStorage.removeItem('tokenPostManAPI');
  localStorage.removeItem('EXPIRATION_KEY');
  liff.init({liffId: '2006630207-4ENd2JnL', }) 
  if(liff.isLoggedIn()){
    liff.logout()
  }
  console.log('Token has been removed. Please log in again.');
  location.reload(); 
}

// ฟังก์ชันในการตรวจสอบและลบ token อัตโนมัติ
function autoRemoveToken(token) {
  if (!token) return;
  try {
    const tokenParts = JSON.parse(atob(token.split('.')[1])); // Decode token โดยไม่ต้องใช้กุญเเจที่เราตั้งได้เลย
    const now = Math.floor(Date.now() / 1000); // เวลาปัจจุบันเป็น Unix timestamp
    const timeUntilExpiration = (tokenParts.exp - now) * 1000; // เวลาที่เหลือในหน่วยมิลลิวินาที

    if (timeUntilExpiration > 0) {
        setTimeout(() => { // ตั้งเวลาให้ตรงตามเวลาที่เหลือก่อน token จะหมด
            removeToken(); 
            alert('Token has expired. Please log in again.');
        }, timeUntilExpiration);
    } else {
        removeToken(); // หาก token หมดอายุแล้วให้ลบทันที
    }
  } catch (error) {
    console.error("Invalid token format:", error); // จัดการกับกรณี token ผิดรูปแบบ
    removeToken(); // ลบ token เพื่อบังคับให้ผู้ใช้ล็อกอินใหม่
  }
}

function removeTokenAdmin() {
  localStorage.removeItem('tokenAdmin');
  localStorage.removeItem('TOKEN_KEY');
  localStorage.removeItem('tokenPostManAPI');
  localStorage.removeItem('EXPIRATION_KEY');
  console.log('Token has been removed. Please log in again.');
  location.reload(); 
}
function autoRemoveTokenAdmin(token) {
  if (!token) return;
  try {
    const tokenParts = JSON.parse(atob(token.split('.')[1])); // Decode token โดยไม่ต้องใช้กุญเเจที่เราตั้งได้เลย
    const now = Math.floor(Date.now() / 1000); // เวลาปัจจุบันเป็น Unix timestamp
    const timeUntilExpiration = (tokenParts.exp - now) * 1000; // เวลาที่เหลือในหน่วยมิลลิวินาที

    if (timeUntilExpiration > 0) {
        setTimeout(() => { // ตั้งเวลาให้ตรงตามเวลาที่เหลือก่อน token จะหมด
            removeTokenAdmin(); 
            alert('Token has expired. Please log in again.');
        }, timeUntilExpiration);
    } else {
      removeTokenAdmin(); // หาก token หมดอายุแล้วให้ลบทันที
    }
  } catch (error) {
    console.error("Invalid token format:", error); // จัดการกับกรณี token ผิดรูปแบบ
    removeTokenAdmin(); // ลบ token เพื่อบังคับให้ผู้ใช้ล็อกอินใหม่
  }
}