import express from "express";
import {
    getCustomer, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer
} from "../../controller/customer/customer.js"
import { verifyCustomer } from "../../middleware/authUser.js"


const router = express.Router();
router.use(express.json());

router.get('/customer',verifyCustomer, getCustomer);
router.get('/customer/:id',verifyCustomer, getCustomerById);
router.post('/customer/sign', createCustomer);
router.patch('/customer/:id',verifyCustomer, updateCustomer);
router.delete('/customer/:id',verifyCustomer, deleteCustomer);


export default router