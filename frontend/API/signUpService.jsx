import React, { createContext, useState } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_Port

export const createCustomer = async(fromData) => {
  try {
    const response  = await axios.post( API_URL + '/customers/create', fromData)
    console.log(response );
    return response 

  } catch (error) {
    console.log("Error signUp:", error);
    throw error;
  }
}

export const FormContext = createContext();

export const FormProviderSignUpService = ({ children }) => {
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    phone_number: '',
    username: '',
    password: '',
    confPassword: '',
  });


  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
}