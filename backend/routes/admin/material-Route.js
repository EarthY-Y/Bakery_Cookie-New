import express from "express";
import multer from 'multer'
import {
    getMaterial, 
    getMaterialById, 
    getProductMaterial,
    getProductMaterialByIdMaterial,
    createMaterial, 
    updateMaterial, 
    deleteMaterial
} from "../../controller/admin/material.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/uploadPictureMaterial.js'

const router = express()
router.use(express.json());

router.get('/admin/material',verifyAdminMid, getMaterial);
router.get('/admin/material/:id',verifyAdminMid, getMaterialById);
router.get('/admin/get/product/material',verifyAdminMid, getProductMaterial);
router.get('/admin/get/product/material/:id',verifyAdminMid, getProductMaterialByIdMaterial);
router.post('/admin/material/create', verifyAdminMid, uploadSingle, (req, res) => { //upload.single(up) อัปโหลดไฟล์เดียว ผ่าน key ชื่อ up
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
  createMaterial(req, res); // เรียกใช้ createMaterial พร้อม req และ res
});
router.patch('/admin/material/update/:id',verifyAdminMid, uploadSingle, (req, res) => { //upload.single(up) อัปโหลดไฟล์เดียว ผ่าน key ชื่อ up
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    if (!req.file && !req.body.materialpic_name) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    updateMaterial(req, res); // เรียกใช้ createMaterial พร้อม req และ res
});
router.delete('/admin/material/delete/:id',verifyAdminMid, deleteMaterial);


export default router