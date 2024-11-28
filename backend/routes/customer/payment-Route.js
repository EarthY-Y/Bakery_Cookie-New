import express from "express";
import {
    validateCustomerAddress,
    getCustomerAddress,
    getPorductCart,
    createOrders,
    getPaymentOrders,
    updatePaymentOrder,
} from "../../controller/customer/payment.js"
import { verifyCustomerMid } from "../../middleware/authUser.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express()
router.use(express.json());

router.get('/customers/validate/customer/address',verifyCustomerMid, validateCustomerAddress);
router.get('/customers/get/customer/address',verifyCustomerMid, getCustomerAddress);
router.post('/customers/create/order',verifyCustomerMid, createOrders);
router.get('/customers/get/orderscart/payment/:id',verifyCustomerMid, getPaymentOrders);
router.get('/customers/cart/product',verifyCustomerMid, getPorductCart);
router.patch('/customers/update/orders/payment/:id',verifyCustomerMid, uploadSingle, (req, res) => { //upload.single(up) อัปโหลดไฟล์เดียว ผ่าน key ชื่อ up
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    updatePaymentOrder(req, res); // เรียกใช้ createMaterial พร้อม req และ res
});
export default router