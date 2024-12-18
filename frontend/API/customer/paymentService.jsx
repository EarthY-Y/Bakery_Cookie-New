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
 
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
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
 
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
  }
}

export const shippingRate = async(weight) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.post(API_URL + "/get/payment/shipping/rate", {weight:weight},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
 
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
  }
}

export const createOrder = async(productCart, totalPrice, totalPriceProduct, price, cost_per_quantity, totalQuantity, shipping_rate_id, houseNo, tambon_nameTH, amphure_nameTH, province_nameTH, zip_code) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.post(API_URL + "/create/order",{productCart:productCart, totalPrice: totalPrice, totalQuantity: totalQuantity, shipping_rate_id: shipping_rate_id,
      totalPriceProduct: totalPriceProduct, shippingRate: price, cost_package_per_quantity: cost_per_quantity,
      houseNo: houseNo, tambon: tambon_nameTH, amphure: amphure_nameTH, province: province_nameTH, zip_code: zip_code},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    return response
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
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
    throw error;
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
    throw error;
  }
}