import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PORT_CUSTOMER 

export const validateAddressCustomer = async() => {
  try {
    const authToken = localStorage.getItem('token')
  
    const response = await axios.get(API_URL + "/validate/customer/address", 
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

export const getAddressCustomer = async() => {
  try {
    const authToken = localStorage.getItem('token')
  
    const response = await axios.get(API_URL + "/get/customer/address", 
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

export const getShippingRate = async() => {
  try {
    const authToken = localStorage.getItem('token')
  
    const response = await axios.get(API_URL + "/get/shipping_rate", 
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

export const createOrder = async(productCart, totalPrice, totalQuantity) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.post(API_URL + "/create/order",{productCart: productCart, totalprice: totalPrice, totalQuantity: totalQuantity},
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

export const getOrdersService = async(id) => {
  try {
    console.log(id);
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/orderscart/payment/"+id, 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    return response
  }catch (error) {
    console.error("Error listProductService:", error);
  }
}

export const updatePaymentOrder = async(formData, id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.patch(API_URL + "/update/orders/payment/"+id, formData, 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    return response
  }catch (error) {
    console.error("Error listProductService:", error);
  }
}