import express from "express";
import {
    getMaterial, 
    getMaterialById, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial
} from "../../controller/admin/material.js"

//import { verifyMaterial } from "../../middleware/authAdmin.js"


const router = express.Router();
router.use(express.json());

// router.get('/Material',verifyMaterial, getMaterial);
// router.get('/Material/:id',verifyMaterial, getMaterialById);
// router.post('/Material/sign',verifyMaterial, createMaterial);
// router.patch('/Material/:id',verifyMaterial, updateMaterial);
// router.delete('/Material/:id',verifyMaterial, deleteMaterial);


router.get('/material', getMaterial);
router.get('/material/:id', getMaterialById);
router.post('/material/create', createMaterial);
router.patch('/material/:id', updateMaterial);
router.delete('/material/:id', deleteMaterial);

export default router