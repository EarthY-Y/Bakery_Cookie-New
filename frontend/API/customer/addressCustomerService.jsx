import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PORT_CUSTOMER 

export const getAllAddressCustomer = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/all/address", 
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
  }
}

export const getAddressById = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/address/"+id, 
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
  }
}

export const updateAddressById = async(tambonsId, amphuresId, provincesId, houseNo, postCode, id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.patch(API_URL + "/update/address/by/"+id, {tambonsId:tambonsId, amphuresId:amphuresId, provincesId:provincesId, houseNo:houseNo, postCode:postCode},
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
  }
}

export const deleteAddressById = async(addressId) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.patch(API_URL + "/delete/address", {addressId},
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
  }
}