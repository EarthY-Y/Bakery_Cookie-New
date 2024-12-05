import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const listOrderSuccessService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin');
        const response = await axios.get(API_URL + "/get/orders/history/list/success", 
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

export const listOrderHistoryCancelService = async() => {
  try {
      const authToken = localStorage.getItem('tokenAdmin');
      const response = await axios.get(API_URL + "/get/orders/list/history/cancel", 
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
    const response = await axios.get(API_URL + "/view/detail/orderhistory/"+id, 
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

export const getStatusOrderHistoryByIdService = async(id) => {
  try {

    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/view/detail/status/order/history/"+id, 
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