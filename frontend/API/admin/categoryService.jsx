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


export const createCategoryService = async() => {
    try {
        const authToken = localStorage.getItem('token')
        const response = await axios.post(API_URL + "/create/category", 
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