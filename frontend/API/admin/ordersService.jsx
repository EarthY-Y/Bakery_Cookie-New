import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_PORT_ADMIN

export const listOrderService = async() => {
    try {

        const authToken = localStorage.getItem('token')
        ;
        const response = await axios.get(API_URL + "/get/orders/list", 
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