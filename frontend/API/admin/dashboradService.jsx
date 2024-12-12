import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const amoutOrdersService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL+"/dashboard/get/amout/order", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        console.log(response);
        return response
    } catch (error) {
        console.error("Error listAdminService:", error);
    }
}

export const salesService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL+"/dashboard/get/sales", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        console.log(response);
        return response
    } catch (error) {
        console.error("Error listAdminService:", error);
    }
}

export const newCustomerService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL+"/dashboard/get/new/customer", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        console.log(response);
        return response
    } catch (error) {
        console.error("Error listAdminService:", error);
    }
}

export const growthUpSalesService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL+"/dashboard/get/growth/sales", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        console.log(response);
        return response
    } catch (error) {
        console.error("Error listAdminService:", error);
    }
}

export const salesPankPerMonthService = async() => {
    try {
        const authToken = localStorage.getItem('tokenAdmin')
        const response = await axios.get(API_URL+"/dashboard/get/sales/rank/per/mouth", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        console.log(response);
        return response
    } catch (error) {
        console.error("Error listAdminService:", error);
    }
}

export const salesPerMonthService = async() => {
  try {
      const authToken = localStorage.getItem('tokenAdmin')
      const response = await axios.get(API_URL+"/dashboard/get/sales/per/mouth", 
        {
          headers: {
            'authorization': `Bearer ${authToken}`
          }
        }
      ); 
      console.log(response);
      return response
  } catch (error) {
      console.error("Error listAdminService:", error);
  }
}