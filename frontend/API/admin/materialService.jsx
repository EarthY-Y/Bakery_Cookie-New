import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const createMaterialService = async(formData) => { 
    console.log(formData);
    try {
        const authToken = localStorage.getItem('token')
        ;
        const res = await axios.post(API_URL + '/material/create', formData,
            {
                headers: {
                    'authorization': `Bearer ${authToken}`
                }
            }
        );
        console.log(res);
        return res;
      } catch (error) {
        console.error("Error createMaterialService:", error);
        throw error; // ส่ง error ออกไปให้ component จัดการ
      }
}
export const listMaterialService = async() => {
    try {

        const authToken = localStorage.getItem('token')
        ;
        const response = await axios.get(API_URL + "/material", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        return response
    } catch (error) {
        console.error("Error listMaterialService:", error);
    }
}

export const listMaterialByIdService = async(id) => {
    try {
        console.log(id);
        
        const authToken = localStorage.getItem('token')
        ;
        const response = await axios.get(API_URL + "/material/"+id, 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        return response
    } catch (error) {
        console.error("Error listMaterialByIdService:", error);
    }
}

export const updateMaterialService = async(formData,id) => {
  try {
    const authToken = localStorage.getItem('token')
    ;
    const res = await axios.patch(API_URL + '/material/update/'+id, formData,
      {
          headers: {
              'authorization': `Bearer ${authToken}`
          }
      }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error updateMaterialService:", error);
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
}


export const deleteMaterialByIdService = async(id) => {
    try {
        console.log(id);
        
        const authToken = localStorage.getItem('token')
        ;
        const response = await axios.delete(API_URL + "/material/delete/"+id, 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        return response
    } catch (error) {
        console.error("Error deleteMaterialByIdService:", error);
    }
}