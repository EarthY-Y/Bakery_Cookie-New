import express from "express";
import {
    getCustomer, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer
} from "../controller/customer.js"

const router = express.Router();

router.get('/customer', getCustomer);
router.get('/customer/:id', getCustomerById);
router.post('/customer', createCustomer);
router.patch('/customer/:id', updateCustomer);
router.delete('/customer/:id', deleteCustomer);


export default router