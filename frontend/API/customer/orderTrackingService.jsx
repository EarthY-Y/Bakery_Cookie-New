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
    throw error;
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
    throw error;
  }
}

export const getlistOrdersCancel = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/orders/list/cancel", 
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

export const getlistOrdersFinish = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/orders/list/finish", 
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

export const orderDetailById = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/detail/order/by/"+id, 
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

export const orderHistoryById = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/history/order/by/"+id, 
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

export const orderProductById = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/order/product/by/"+id, 
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

export const orderTrackingAddressService = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/order/address/tracking/by/"+id, 
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

export const cancelOrder = async(id,reason) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.patch(API_URL + "/cancle/order/product/by/"+id,{reason:reason},
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

