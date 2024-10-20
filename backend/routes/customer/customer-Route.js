import express from "express";
import {
    getCustomer, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer
} from "../../controller/customer/customer.js"
import { verifyCustomerMid } from "../../middleware/authUser.js"


const router = express.Router();
router.use(express.json());

router.get('/customer',verifyCustomerMid, getCustomer);
router.get('/customer/:id',verifyCustomerMid, getCustomerById);
router.post('/customer/sign', createCustomer);
router.patch('/customer/:id',verifyCustomerMid, updateCustomer);
router.delete('/customer/:id',verifyCustomerMid, deleteCustomer);


export default router