import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const manageCustomerListService = async () => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.get(API_URL + "/get/manage/customer/list",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    // console.log(response);
    return response
  } catch (error) {
    throw new error
  }
}

export const manageCustomerServiceById = async (id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.get(API_URL + "/get/manage/customer/by/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    // console.log(response);
    return response
  } catch (error) {
    throw new error
  }
}

export const manageCustomerAddressServiceById = async (id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.get(API_URL + "/get/manage/customer/address/by/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    // console.log(response);
    return response
  } catch (error) {
    throw new error
  }
}

export const updateCustomerActiveServiceById = async (id, active) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.patch(API_URL + "/get/manage/customer/active/by/" + id, { active: active },
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    // console.log(response);
    return response
  } catch (error) {
    throw new error
  }
}
