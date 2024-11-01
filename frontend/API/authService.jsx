import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_Port
//ระบบ login
export const login = async (userName, passWord) => {
  try {
    const res = await axios.post(API_URL+'/login', { userName, passWord });
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
};

//authRouth
export const ProtectedRouteAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found. Redirecting to login...");
        setLoading(false);
        return;
      }
      autoRemoveToken(token)
      try {
        console.log("Verifying token...");
        const resAdmin = await axios.get(API_URL+'/verifyAdmin', {
          headers: {
            'authorization': `Bearer ${token}`
          }
        });
        console.log('Response from verifyAdmin:', resAdmin.data);
        
        if (resAdmin.data.results && resAdmin.data.results.length !== 0) {
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
    return <div>Loading...</div>;
  }

  if (!token || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;//จะเเสดง Route ลูกที่ Function นี้ครอบไว้ใน App.jsx
};

export const ProtectedRouteCustomer = () => {
  const [loading, setLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log("No token found. Redirecting to login...");
        setLoading(false);
        return;
      }
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
        } else {
          console.log("User is not an customer. Redirecting to login...");
          setIsCustomer(false);
        }
      } catch (error) {
        console.error('Error during token verification:', error);
        setIsCustomer(false); 
      } finally {
        setLoading(false); 
      }
    };
    verifyToken();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !isCustomer) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

// ฟังก์ชันในการลบ token
function removeToken() {
  localStorage.removeItem('token'); // ลบ token ออกจาก Local Storage
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
