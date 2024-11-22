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
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/customers/get/profile',verifyCustomerMid, getCustomer);
router.get('/customers/get/profile:id',verifyCustomerMid, getCustomerById);
router.post('/customers/create', createCustomer);
router.patch('/customers/edit/profile/:id',verifyCustomerMid, uploadSingle, (req, res) => { //upload.single(up) อัปโหลดไฟล์เดียว ผ่าน key ชื่อ up
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    console.log(req.body);
    
    if (!req.file && !req.body.customerpic) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    updateCustomer(req, res); // เรียกใช้ createMaterial พร้อม req และ res
});
router.delete('/customers/delete/profile:id',verifyCustomerMid, deleteCustomer);
router.post('/customers/create/address',verifyCustomerMid, createAddress);

export default router