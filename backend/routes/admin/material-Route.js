import express from "express";
import {
    getMaterial, 
    getMaterialById, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial
} from "../../controller/admin/material.js"
import { verifyAdmin } from "../../middleware/authAdmin.js"


const router = express.Router();
router.use(express.json());

router.get('/Material',verifyAdmin, getMaterial);
router.get('/Material/:id',verifyAdmin, getMaterialById);
router.post('/Material/sign',verifyAdmin, createMaterial);
router.patch('/Material/:id',verifyAdmin, updateMaterial);
router.delete('/Material/:id',verifyAdmin, deleteMaterial);


export default router