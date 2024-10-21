import express from "express";
import multer from 'multer'
import {
    getMaterial, 
    getMaterialById, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial
} from "../../controller/admin/material.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express()
router.use(express.json());

router.get('/material',verifyAdminMid, getMaterial);
router.get('/material/:id',verifyAdminMid, getMaterialById);
router.post('/material/create', verifyAdminMid, uploadSingle, (req, res) => { //upload.single(up) อัปโหลดไฟล์เดียว ผ่าน key ชื่อ up
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
  createMaterial(req, res); // เรียกใช้ createMaterial พร้อม req และ res
});
router.patch('/material/:id',verifyAdminMid, updateMaterial);
router.delete('/material/:id',verifyAdminMid, deleteMaterial);


export default router