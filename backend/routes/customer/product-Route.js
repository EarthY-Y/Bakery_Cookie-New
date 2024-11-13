import express from "express";
import {
    getProductCustomer, 
    getProductById,
    getCart,
    createPorductCart,
    updatePorductCart,
    getPorductCart,
    deleteProductCart,
} from "../../controller/customer/product.js"

import { verifyCustomerMid } from "../../middleware/authUser.js"

const router = express.Router();
router.use(express.json());

router.get('/customers/product',verifyCustomerMid, getProductCustomer);
router.get('/customers/product/:id',verifyCustomerMid, getProductById);
router.get('/customers/get/cart',verifyCustomerMid, getCart);
router.post('/customers/create/cart/porduct',verifyCustomerMid, createPorductCart);
router.patch('/customers/update/product',verifyCustomerMid, updatePorductCart);
router.get('/customers/cart/product',verifyCustomerMid, getPorductCart);
router.delete('/customers/delete/cart/product/:id',verifyCustomerMid, deleteProductCart);
export default router