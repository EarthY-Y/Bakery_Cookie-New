import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const getListCategoryOrderStatusService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL + "/get/list/category/orderStatus", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        return response
      } catch (error) {
        console.error("Error listMaterialService:", error);
        throw error
    }
}

export const getListOrderStatusService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL + "/get/list/orderStatus/create", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        return response
      } catch (error) {
        console.error("Error listMaterialService:", error);
        throw error
    }
}

export const getCategoryOrderStatusByIdService = async(id) => {
  try {
      const authToken = localStorage.getItem('tokenAdmin')
      const response = await axios.get(API_URL + "/get/category/orderStatus/"+id, 
        {
          headers: {
            'authorization': `Bearer ${authToken}`
          }
        }
      ); 
      return response
    } catch (error) {
      console.error("Error listMaterialService:", error);
      throw error
  }
}

export const createCategoryOrderStatusService = async(categoryName, selectedorderStatus) => {
    try {
        console.log(selectedorderStatus, categoryName);        
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.post(API_URL + "/create/category/orderStatus",{categoryName:categoryName,selectedorderStatus:selectedorderStatus},
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        return response
      } catch (error) {
        console.error("Error listMaterialService:", error);
        throw error
    }
}

export const updateCategoryOrderStatusService = async(id, changesCategoryProduct) => {
  try {     
      const authToken = localStorage.getItem('tokenAdmin')
      const response = await axios.patch(API_URL + "/edit/category/orderStatus/"+id,{changesCategoryProduct:changesCategoryProduct},
        {
          headers: {
            'authorization': `Bearer ${authToken}`
          }
        }
      ); 
      return response
    } catch (error) {
      console.error("Error listMaterialService:", error);
      throw error
  }
}