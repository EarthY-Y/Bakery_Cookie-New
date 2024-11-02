import axios from 'axios';
import React, { createContext, useState } from 'react';

export const createProductService = async(fromData) => { 
    console.log(fromData);
    try {
      const API_URL = import.meta.env.VITE_API_Port
      const authToken = localStorage.getItem('token')
      console.log(authToken);
      const res = await axios.post(API_URL + '/product/create', fromData,
          {
              headers: {
                  'authorization': `Bearer ${authToken}`,
                   'Content-Type': 'multipart/form-data'
              }
          }
      );
      console.log(res);
      return res;
    } catch (error) {
      console.error("Error createProductService:", error);
      throw error; // ส่ง error ออกไปให้ component จัดการ
    }
}
export const listProductService = async() => {
    try {
      const API_URL = import.meta.env.VITE_API_Port
      console.log(API_URL);
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

export const FormContextMaterialProduct = createContext();

export const FormProviderProductService = ({ children }) => {
  const [formData, setFormData] = useState({})

  return (
    <FormContextMaterialProduct.Provider value={{ formData, setFormData }}>
      {children}
    </FormContextMaterialProduct.Provider>
  );
}