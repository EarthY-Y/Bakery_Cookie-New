import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PORT_CUSTOMER 

export const getDeatialCustomerService = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/profile/by/id", 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
  }
}

export const updateInfoCustomer = async(id, formData) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.patch(API_URL + "/edit/profile/"+id, formData,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
  }
}

export const createConnectionLineIDService = async(profile, provider_name) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.post(API_URL + "/create/connect/line", {profile:profile, provider_name:provider_name},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error
  }
}

export const checkConnectionLineIDService = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/check/connect/line",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error
  }
}

export const changePasswordService = async(newPassword, confirmNewPassword) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.patch(API_URL + "/change/password", {newPassword:newPassword, confirmNewPassword:confirmNewPassword},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error
  }
}