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
router.post('/admin/create', createAdmin);
router.patch('/admin/:id',verifyAdminMid, updateAdmin);
router.delete('/admin/:id',verifyAdminMid, deleteAdmin);


export default router