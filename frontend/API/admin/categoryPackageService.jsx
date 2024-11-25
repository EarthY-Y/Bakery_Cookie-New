import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const getListCategoryService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL + "/get/list/category/package", 
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

export const getListPackageService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL + "/package", 
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

export const getCategoryPackageByIdService = async(id) => {
  try {
      const authToken = localStorage.getItem('tokenAdmin')
      const response = await axios.get(API_URL + "/get/category/package/"+id, 
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

export const createCategoryPackageService = async(categoryName, selectedPackage) => {
    try {
        console.log(selectedPackage, categoryName);        
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.post(API_URL + "/create/category/package",{categoryName:categoryName,selectedPackage:selectedPackage},
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

export const updateCategoryPackageService = async(id, changesCategoryProduct) => {
  try {     
      const authToken = localStorage.getItem('tokenAdmin')
      const response = await axios.patch(API_URL + "/edit/category/package/"+id,{changesCategoryProduct:changesCategoryProduct},
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