import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_Port

export const createMaterialService = async(fromData) => { 
    console.log(fromData);
    try {
        const authToken = localStorage.getItem('token')
        console.log(authToken);
        const res = await axios.post(API_URL + '/material/create', fromData,
            {
                headers: {
                    'authorization': `Bearer ${authToken}`
                }
            }
        );
        console.log(res);
        return res;
      } catch (error) {
        console.error("Error during login:", error);
        throw error; // ส่ง error ออกไปให้ component จัดการ
      }
}
export const listMaterialService = async() => {
    try {

        const authToken = localStorage.getItem('token')
        console.log(authToken);
        const response = await axios.get(API_URL + "/material", 
          {
            headers: {
              'authorization': `Bearer ${authToken}`
            }
          }
        ); 
        console.log(response);
        return response
    } catch (error) {
        console.error("Error during login:", error);
    }
}
const validateInputs = (inputs, validationRules) => {
    for (const key in validationRules) {
        const { value, required, type, min } = validationRules[key];

        // Check if the field is required and not provided
        if (required && (value === undefined || value === null)) {
            throw new Error(`${key} is required.`);
        }

        // Check type
        if (type && typeof value !== type) {
            throw new Error(`${key} must be of type ${type}.`);
        }

        // Check minimum value
        if (min !== undefined && value < min) {
            throw new Error(`${key} must be greater than or equal to ${min}.`);
        }
    }
};

