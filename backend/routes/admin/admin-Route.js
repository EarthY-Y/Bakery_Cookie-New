import express from "express";
import {
    getAdmin, 
    getAdminById, 
    createAdmin, 
    updateAdmin, 
    deleteAdmin
} from "../../controller/admin/admin.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"


const router = express.Router();
router.use(express.json());

router.get('/Admin',verifyAdminMid, getAdmin);
router.get('/Admin/:id',verifyAdminMid, getAdminById);
router.post('/Admin/sign', createAdmin);
router.patch('/Admin/:id',verifyAdminMid, updateAdmin);
router.delete('/Admin/:id',verifyAdminMid, deleteAdmin);


export default router