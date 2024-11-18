import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const getListCategoryService = async() => {
    try {
        const authToken = localStorage.getItem('token')
        const response = await axios.get(API_URL + "/get/list/category", 
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

export const getListProductPictureService = async() => {
    try {
        const authToken = localStorage.getItem('token')
        const response = await axios.get(API_URL + "/get/product/picture", 
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

export const getCategoryByIdService = async(id) => {
  try {
      const authToken = localStorage.getItem('token')
      const response = await axios.get(API_URL + "/get/category/"+id, 
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

export const createCategoryService = async(categoryName, selectedProducts) => {
    try {
        console.log(selectedProducts, categoryName);        
        const authToken = localStorage.getItem('token')
        const response = await axios.post(API_URL + "/create/category",{categoryName:categoryName,selectedProducts:selectedProducts},
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

export const updateCategoryProductService = async(id, changesCategoryProduct) => {
  try {     
      const authToken = localStorage.getItem('token')
      const response = await axios.patch(API_URL + "/edit/category/"+id,{changesCategoryProduct:changesCategoryProduct},
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