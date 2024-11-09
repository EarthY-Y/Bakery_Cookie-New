import express from "express";
import {
    getProductCustomer, 
    getProductById, 
} from "../../controller/customer/product.js"

import { verifyCustomerMid } from "../../middleware/authUser.js"

const router = express.Router();
router.use(express.json());

router.get('/customers/product',verifyCustomerMid, getProductCustomer);
router.get('/customers/product/:id',verifyCustomerMid, getProductById);

export default router