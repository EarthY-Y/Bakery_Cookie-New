import express from "express";
import {
    getCustomerAddress
} from "../../controller/customer/payment.js"
import { verifyCustomerMid } from "../../middleware/authUser.js"


const router = express.Router();
router.use(express.json());

router.get('/customers/get/customer/address',verifyCustomerMid, getCustomerAddress);

export default router