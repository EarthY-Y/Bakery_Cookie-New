import express from "express";
import {
    validateCustomerAddress,
    getCustomerAddress,
    createOrders
} from "../../controller/customer/payment.js"
import { verifyCustomerMid } from "../../middleware/authUser.js"


const router = express.Router();
router.use(express.json());

router.get('/customers/validate/customer/address',verifyCustomerMid, validateCustomerAddress);
router.get('/customers/get/customer/address',verifyCustomerMid, getCustomerAddress);
router.post('/customers/create/order',verifyCustomerMid, createOrders);
export default router