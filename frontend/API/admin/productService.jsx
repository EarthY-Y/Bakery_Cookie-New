import axios from 'axios';
import React, { createContext, useState } from 'react';
const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const createProductService = async(fromData) => { 
    console.log(fromData);
    try {

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
      //console.log(response);
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

export const editProductService = async(fromData, id) => { 
  console.log(fromData);
  try {

    const authToken = localStorage.getItem('token')
    console.log(authToken);
    const res = await axios.patch(API_URL + '/product/edit/'+id, fromData,
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

export const deleteProductByIdService = async(id) => {
  try {
    console.log(id);
    const authToken = localStorage.getItem('token')
    console.log(authToken);
    const response = await axios.delete(API_URL + "/product/delete/"+id, 
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

export const FormContextMaterialProduct = createContext();

export const FormProviderProductService = ({ children }) => {
  const [formData, setFormData] = useState({})

  return (
    <FormContextMaterialProduct.Provider value={{ formData, setFormData }}>
      {children}
    </FormContextMaterialProduct.Provider>
  );
}