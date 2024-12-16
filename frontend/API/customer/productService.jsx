import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PORT_CUSTOMER 

export const listProductService = async() => {
  try {
    const authToken = localStorage.getItem('token')
  
    const response = await axios.get(API_URL + "/get/product", 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    console.log(response);
    return response
  }catch (error) {
    console.error("Error listProductService:", error);
  }
}

export const getCartService = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/cart", 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    //console.log(response);
    return response
  }catch (error) {
    console.error("Error listProductByIdService:", error);
  }
}

export const detailProductByIdService = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
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
    console.error("Error listProductByIdService:", error);
  }
}

export const createCartService = async(productId, cartId, price, quantity) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.post(API_URL + "/create/cart/porduct", {productId: productId, cartId: cartId, selling_price_per_quantity: price, quantity: quantity},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    //console.log(response);
    return response
  }catch (error) {
    console.error("Error listProductByIdService:", error);
  }
}

export const getPorductCartService = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/cart/product", 
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

export const upadateCartService = async(cart_product_id, status, value) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.patch(API_URL + "/update/product", {cart_product_id: cart_product_id, status: status, value:value},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    //console.log(response);
    return response
  }catch (error) {
    console.error("Error listProductByIdService:", error);
  }
}

export const deletePorductCartService = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.delete(API_URL + "/delete/cart/product/"+id, 
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

export const getCategoryService = async() => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.get(API_URL + "/get/nav/category", 
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

export const listProductCategoryService = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
  
    const response = await axios.get(API_URL + "/get/product/category/"+id, 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    console.log(response);
    return response
  }catch (error) {
    console.error("Error listProductService:", error);
  }
}
