import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const CreateStatusCartService = async(statusId,statusName,statusfor) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.post(API_URL + "/create/status", {statusId:statusId, statusName:statusName,statusfor:statusfor},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
  }
}

export const listOrderWaitStatementService = async() => {
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
    }
}

export const listOrderCheckOutService = async() => {
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
  }
}

export const getOrderByIdService = async(id) => {
  try {

    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/view/detail/order/"+id, 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
  }
}

export const getOrderHistoryByIdService = async(id) => {
  try {

    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/view/detail/order/history/"+id, 
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
  }
}

export const getStatusOrderService = async() => {
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
  }
}

export const getStatusCartService = async() => {
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
  }
}
export const getStatusCartServiceById = async(id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/status/cart/"+id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
  }
}

export const getStatusOrderServiceById = async(id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/status/order/"+id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
  }
}

export const getOrderAddressService = async(id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/order/address/"+id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
  }
}

export const updateStatusCartServiceById = async(id,statusName) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.patch(API_URL + "/update/status/cart/"+id, {statusName:statusName},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
  }
}

export const updateStatusOrderServiceById = async(id,statusName) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.patch(API_URL + "/update/status/order/"+id, {statusName:statusName},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    ); 
    return response
  } catch (error) {
    console.error("Error listMaterialService:", error);
  }
}

export const updateStatusOrderService = async(value ,id, skip) => {
  try {

    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.patch(API_URL + "/update/status/"+id, {status:value, skip:skip}, 
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