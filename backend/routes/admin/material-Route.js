import express from "express";
import {
    getMaterial, 
    getMaterialById, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial
} from "../../controller/admin/material.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"


const router = express.Router();
router.use(express.json());

router.get('/material',verifyAdminMid, getMaterial);
router.get('/material/:id',verifyAdminMid, getMaterialById);
router.post('/material/create',verifyAdminMid, createMaterial);
router.patch('/material/:id',verifyAdminMid, updateMaterial);
router.delete('/material/:id',verifyAdminMid, deleteMaterial);


export default router