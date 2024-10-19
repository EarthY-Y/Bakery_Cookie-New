import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

export const createMaterialService = async(MaterialName, Quantities, Costes) => {
    await axios.post('http://localhost:5000/material/create',{material_name: MaterialName, quantity: Quantities, cost:Costes})
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