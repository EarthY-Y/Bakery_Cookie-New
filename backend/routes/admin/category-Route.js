import express from "express";
import {
    getListCategory,
    getProductPicture, 
    craeteCategory,
} from "../../controller/admin/category.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/get/list/category',verifyAdminMid, getListCategory);
router.get('/admin/get/product/picture',verifyAdminMid, getProductPicture);
router.post('/admin/get/list/category',verifyAdminMid, craeteCategory);

export default router