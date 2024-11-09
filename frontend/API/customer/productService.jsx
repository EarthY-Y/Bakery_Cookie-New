import axios from 'axios';
import React, { createContext, useState } from 'react';
const API_URL = import.meta.env.VITE_API_PORT_CUSTOMER 

export const listProductService = async() => {
    try {
      const authToken = localStorage.getItem('token')
      console.log(authToken);
      const response = await axios.get(API_URL + "/product", 
        {
          headers: {
            'authorization': `Bearer ${authToken}`
          }
        }
      );  
      console.log(response);
      return response
    }catch (error) {
      console.error("Error during login:", error);
    }
}

export const listProductByIdService = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
    console.log(authToken);
    const response = await axios.get(API_URL + "/product/"+id, 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    //console.log(response);
    return response
  }catch (error) {
    console.error("Error during login:", error);
  }
}