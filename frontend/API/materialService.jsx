import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

export const createMaterialService = async(MaterialName, Quantities, Costes, /*Picture,*/ authToken) => { 
    
    try {
        const res = await axios.post('http://localhost:5000/material/create', { material_name: MaterialName, quantity: Quantities, cost:Costes, /*materialpic_name:Picture*/ },
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

