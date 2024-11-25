import express from "express";
import {
    getpackage, 
    getpackageById, 
    createpackage, 
    updatepackage, 
    deletepackage
} from "../../controller/admin/package.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/package',verifyAdminMid, getpackage);
router.get('/admin/package/:id',verifyAdminMid, getpackageById);
router.post('/admin/package/create',verifyAdminMid, uploadSingle,(req, res) => {
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    console.log(req.body);
    
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    console.log("its req.body package-Route",req.body);
    
    createpackage(req, res);
});
router.patch('/admin/package/edit/:id',verifyAdminMid, uploadSingle, (req, res) => { 
    // เช็คว่าไฟล์ถูกอัปโหลดหรือไม่
    if (!req.file && !req.body.package_pic) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
    updatepackage(req, res);
});
router.delete('/admin/package/delete/:id',verifyAdminMid, deletepackage);

export default router