import express from "express";
import {
    getProduct, 
    getProductById, 
    getPackages,
    getProductPackageById,
    createProduct, 
    updateProduct, 
    deleteProduct
} from "../../controller/admin/product.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/uploadPictureProduct.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/product',verifyAdminMid, getProduct);
router.get('/admin/product/get/packages',verifyAdminMid, getPackages);
router.get('/admin/product/:id',verifyAdminMid, getProductById);
router.get('/admin/product/get/packages/:id',verifyAdminMid, getProductPackageById);
router.post('/admin/product/create',verifyAdminMid, uploadSingle,(req, res) => {
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    console.log(req.body);
    
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    console.log("its req.body product-Route",req.body);
    
    createProduct(req, res);
});
router.patch('/admin/product/edit/:id',verifyAdminMid, uploadSingle, (req, res) => { 
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    if (!req.file && !req.body.productpic_name) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    updateProduct(req, res);
});
router.delete('/admin/product/delete/:id',verifyAdminMid, deleteProduct);

export default router