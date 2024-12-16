import express from "express";
import {
    getProductCustomer, 
    getProductById,
    getCart,
    getNavbarCategory,
    getCategoryProduct,
    createCart,
    createPorductCart,
    updatePorductCart,
    deleteProductCart,
} from "../../controller/customer/product.js"

import { verifyCustomerMid } from "../../middleware/authUser.js"

const router = express.Router();
router.use(express.json());

router.get('/customers/get/product',verifyCustomerMid, getProductCustomer); //ตั้งว่า /product ไม่ได้เพราะว่าไปซ้ำกับฝั่ง admin ต้องระวังเรื่องการตั้ง Route ซ้ำ
router.get('/customers/product/:id',verifyCustomerMid, getProductById);
router.get('/customers/get/cart',verifyCustomerMid, getCart);
router.get('/customers/get/nav/category',verifyCustomerMid, getNavbarCategory);
router.get('/customers/get/product/category/:id',verifyCustomerMid, getCategoryProduct);
router.post('/customers/create/cart/porduct',verifyCustomerMid, createPorductCart);
router.post('/customers/create/cart',verifyCustomerMid, createCart);
router.patch('/customers/update/product',verifyCustomerMid, updatePorductCart);
router.delete('/customers/delete/cart/product/:id',verifyCustomerMid, deleteProductCart);
export default router