import express from "express";
import {
    getProduct, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct
} from "../../controller/admin/product.js"

//import { verifyProduct } from "../../middleware/authAdmin.js"


const router = express.Router();
router.use(express.json());

// router.get('/Product',verifyProduct, getProduct);
// router.get('/Product/:id',verifyProduct, getProductById);
// router.post('/Product/sign',verifyProduct, createProduct);
// router.patch('/Product/:id',verifyProduct, updateProduct);
// router.delete('/Product/:id',verifyProduct, deleteProduct);


router.get('/Product', getProduct);
router.get('/Product/:id', getProductById);
router.post('/Product/sign', createProduct);
router.patch('/Product/:id', updateProduct);
router.delete('/Product/:id', deleteProduct);

export default router