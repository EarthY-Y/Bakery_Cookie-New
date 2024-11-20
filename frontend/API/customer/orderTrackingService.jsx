import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PORT_CUSTOMER 

export const getlistOrdersWaitPayment = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/orders/list/waitstatement", 
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

export const getlistOrdersprocess = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/orders/list/inprocess", 
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