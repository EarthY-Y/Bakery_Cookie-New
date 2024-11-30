import express from "express";
import {
    guestGetProductById,
    gusetGetProductCustomer
} from "../../controller/guest/product.js"

import { verifyCustomerMid } from "../../middleware/authUser.js"

const router = express.Router();
router.use(express.json());

router.get('/guest/get/product', gusetGetProductCustomer); //ตั้งว่า /product ไม่ได้เพราะว่าไปซ้ำกับฝั่ง admin ต้องระวังเรื่องการตั้ง Route ซ้ำ
router.get('/guest/product/:id', guestGetProductById);

export default router