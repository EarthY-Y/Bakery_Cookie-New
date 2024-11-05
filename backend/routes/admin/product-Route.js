import express from "express";
import {
    getProduct, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct
} from "../../controller/admin/product.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/product',verifyAdminMid, getProduct);
router.get('/admin/product/:id',verifyAdminMid, getProductById);
router.post('/admin/product/create',verifyAdminMid, uploadSingle,(req, res) => { //upload.single(up) อัปโหลดไฟล์เดียว ผ่าน key ชื่อ up
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    console.log(req.body);
    
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    console.log("its req.body product-Route",req.body);
    
    createProduct(req, res); // เรียกใช้ createMaterial พร้อม req และ res
});
router.patch('/admin/product/:id',verifyAdminMid, updateProduct);
router.delete('/admin/product/delete/:id',verifyAdminMid, deleteProduct);

export default router