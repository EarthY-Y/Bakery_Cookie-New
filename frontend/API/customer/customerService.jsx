import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PORT_CUSTOMER 

export const getDeatialCustomer = async() => {
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