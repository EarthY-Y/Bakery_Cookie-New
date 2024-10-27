import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

export const createAdminService = async(fromData) => { 
    console.log(fromData);
    try {
        const authToken = localStorage.getItem('token')
        console.log(authToken);
        const res = await axios.post('http://localhost:5000/admin/create', fromData,
            {
                headers: {
                    'authorization': `Bearer ${authToken}`
                }
            }
        );
        console.log(res);
        return res;
      } catch (error) {
        console.error("Error during login:", error);
        throw error; // ส่ง error ออกไปให้ component จัดการ
      }
}

export const listAdminService = async() => {
    try {
        const authToken = localStorage.getItem('token')
        console.log(authToken);
        const response = await axios.get("http://localhost:5000/admin", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        console.log(response);
        return response
    } catch (error) {
        console.error("Error during login:", error);
    }
}