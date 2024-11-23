import express from "express";
import {
    getListCategory,
    getProductPicture, 
    craeteCategory,
    updateCategoryProduct,
    getCategoryById,
} from "../../controller/admin/category.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/get/list/category',verifyAdminMid, getListCategory);
router.get('/admin/get/product/picture',verifyAdminMid, getProductPicture);
router.get('/admin/get/category/:id',verifyAdminMid, getCategoryById);
router.post('/admin/create/category',verifyAdminMid, craeteCategory);
router.patch('/admin/edit/category/:id',verifyAdminMid, updateCategoryProduct);

export default router