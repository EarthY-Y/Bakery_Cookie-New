import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const createShippingService = async (carrierName, serviceType, weightRangeMin, weightRangeMax, price, deliveryDays, packageId) => {
  console.log(carrierName, serviceType, weightRangeMin, weightRangeMax, price, deliveryDays, packageId);
  try {
    const authToken = localStorage.getItem('tokenAdmin');
    const res = await axios.post(API_URL + '/shipping/create', {carrierName:carrierName, serviceType:serviceType, weightRangeMin:weightRangeMin, 
      weightRangeMax:weightRangeMax, price:price, deliveryDays:deliveryDays, packageId:packageId},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error createShippingService:", error);
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
}
export const listShippingService = async () => {
  try {

    const authToken = localStorage.getItem('tokenAdmin');
    const response = await axios.get(API_URL + "/get/list/shipping",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listShippingService:", error);
  }
}

export const listShippingByIdService = async (id) => {
  try {
    console.log(id);

    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.get(API_URL + "/get/get/shipping/by/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listShippingByIdService:", error);
  }
}
export const listShippingPackageService = async () => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.get(API_URL + "/get/shipping/package",
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error listShippingByIdService:", error);
  }
}

export const updateShippingService = async (carrierName, serviceType, weightRangeMin, weightRangeMax, price, deliveryDays, packageId, id) => {
  try {
    const authToken = localStorage.getItem('tokenAdmin')
    const res = await axios.patch(API_URL + '/shipping/update/' + id, {carrierName:carrierName, serviceType:serviceType, weightRangeMin:weightRangeMin, 
      weightRangeMax:weightRangeMax, price:price, deliveryDays:deliveryDays, packageId:packageId},
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error updateShippingService:", error);
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
}


export const deleteShippingByIdService = async (id) => {
  try {
    console.log(id);

    const authToken = localStorage.getItem('tokenAdmin')
    const response = await axios.delete(API_URL + "/shipping/delete/" + id,
      {
        headers: {
          'authorization': `Bearer ${authToken}`
        }
      }
    );
    return response
  } catch (error) {
    console.error("Error deleteShippingByIdService:", error);
  }
}