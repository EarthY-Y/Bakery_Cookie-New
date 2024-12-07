import axios from 'axios';
const API_URL = import.meta.env.VITE_API_PORT_GUEST 

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