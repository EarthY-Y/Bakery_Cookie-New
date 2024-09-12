import express from "express";
import {
    getAdmin, 
    getAdminById, 
    createAdmin, 
    updateAdmin, 
    deleteAdmin
} from "../../controller/admin/admin.js"

//import { verifyAdmin } from "../../middleware/authAdmin.js"


const router = express.Router();
router.use(express.json());

// router.get('/Admin',verifyAdmin, getAdmin);
// router.get('/Admin/:id',verifyAdmin, getAdminById);
// router.post('/Admin/sign',verifyAdmin, createAdmin);
// router.patch('/Admin/:id',verifyAdmin, updateAdmin);
// router.delete('/Admin/:id',verifyAdmin, deleteAdmin);


router.get('/admin', getAdmin);
router.get('/admin/:id', getAdminById);
router.post('/admin/create', createAdmin);
router.patch('/admin/:id', updateAdmin);
router.delete('/admin/:id', deleteAdmin);

export default router