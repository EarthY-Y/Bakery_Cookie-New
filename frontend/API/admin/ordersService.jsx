import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const CreateStatusCartService = async (statusName, statusfor) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.post(API_URL + "/create/status", { statusName: statusName, statusfor: statusfor },
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const listOrderWaitStatementService = async () => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/orders/list/waitstatement",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const listOrderCheckOutService = async () => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/orders/list/checkout",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const listOrderByStatusNameService = async (id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/order/by/status/name/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const getOrderByIdService = async (id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/view/detail/order/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const getOrderHistoryByIdService = async (id) => {
  try {

    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/view/detail/order/history/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const getStatusOrderListService = async () => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/status/orders/list",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const getStatusOrderService = async () => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/status/order",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const getStatusCartService = async () => {
  try {

    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/status/cart",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}
export const getStatusCartServiceById = async (id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/status/cart/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const getStatusOrderServiceById = async (id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/status/order/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const getOrderAddressService = async (id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/order/address/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const getStatusListForChangeOrder = async () => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/status/list/for/changeOrders",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const updateStatusCartServiceById = async (id, statusName, active) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.patch(API_URL + "/update/status/cart/" + id, { active: active, statusName: statusName },
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const updateStatusOrderServiceById = async (id, statusName, active) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.patch(API_URL + "/edit/status/order/" + id, { active: active, statusName: statusName },
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
    throw error;
  }
}

export const updateStatusOrderService = async (value, id, skip) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.patch(API_URL + "/update/status/order/" + id, { status: value, skip: skip },
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    throw error;
  }
}

export const updatePostCodeOrderService = async (id, postCode) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.patch(API_URL + "/update/postCode/order/" + id, { postCode: postCode },
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    throw error;
  }
}

export const getTracking = async(id) => {
  try {
    const authToken = localStorage.getItem('token')
    const response = await axios.patch(API_URL + "/get/tracking/"+id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );  
    console.log(response);
    return response.data
  }catch (error) {
    console.error("Error validateAddressCustomer:", error);
    throw error;
  }
}