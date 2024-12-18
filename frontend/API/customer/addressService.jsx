import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PORT_CUSTOMER 

export const getProvice = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/provice", 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    console.log(response);
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
  }
}

export const getAmphure = async(provinceId) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/amphure/"+provinceId,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    console.log(response);
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
  }
}

export const getTambon = async(amphureId) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/tambon/"+amphureId,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    console.log(response);
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
  }
}

export const createAddressCustomer = async(tambonsId, amphuresId, provincesId, houseNo, postCode) => {
  try {
    const authToken = localStorage.getItem('token')
    console.log("createAddressCustomer ",tambonsId, amphuresId, provincesId, houseNo, postCode);
    
    const response = await axios.post(API_URL + "/create/address",{tambonsId:tambonsId, amphuresId:amphuresId, provincesId:provincesId, houseNo:houseNo, postCode:postCode},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    console.log(response);
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
  }
}