import express from "express";
import {
    getAdmin, 
    getAdminById, 
    createAdmin, 
    updateAdmin, 
    deleteAdmin
} from "../../controller/admin/admin.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin',verifyAdminMid, getAdmin);
router.get('/admin/:id',verifyAdminMid, getAdminById);
router.post('/admin/create', verifyAdminMid, uploadSingle, (req, res) => { //upload.single(up) อัปโหลดไฟล์เดียว ผ่าน key ชื่อ up
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    createAdmin(req, res); // เรียกใช้ createMaterial พร้อม req และ res
});
router.patch('/admin/:id',verifyAdminMid, updateAdmin);
router.delete('/admin/:id',verifyAdminMid, deleteAdmin);


export default router