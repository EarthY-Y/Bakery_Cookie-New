import express from "express";
import {
    getProduct, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct
} from "../../controller/admin/product.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"


const router = express.Router();
router.use(express.json());

router.get('/Product',verifyAdminMid, getProduct);
router.get('/Product/:id',verifyAdminMid, getProductById);
router.post('/Product/sign',verifyAdminMid, createProduct);
router.patch('/Product/:id',verifyAdminMid, updateProduct);
router.delete('/Product/:id',verifyAdminMid, deleteProduct);

export default router