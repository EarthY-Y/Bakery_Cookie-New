import express from "express";
import {
    getCustomer, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    createAddress
} from "../../controller/customer/customer.js"
import { verifyCustomerMid } from "../../middleware/authUser.js"


const router = express.Router();
router.use(express.json());

router.get('/customers/get',verifyCustomerMid, getCustomer);
router.get('/customers/:id',verifyCustomerMid, getCustomerById);
router.post('/customers/create', createCustomer);
router.patch('/customers/:id',verifyCustomerMid, updateCustomer);
router.delete('/customers/:id',verifyCustomerMid, deleteCustomer);

router.post('/customers/create/address',verifyCustomerMid, createAddress);
export default router