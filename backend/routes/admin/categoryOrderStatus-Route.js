import express from "express";
import {
    getListCategoryOrderStatus,
    getStatusOrderslist,
    craetePacakageCategory,
    updateCategoryPackage,
    getCategoryPackageById,
} from "../../controller/admin/categoryOrderStatus.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/get/list/category/orderStatus',verifyAdminMid, getListCategoryOrderStatus);
router.get('/admin/get/list/orderStatus/create',verifyAdminMid, getStatusOrderslist,);
router.get('/admin/get/category/orderStatus/:id',verifyAdminMid, getCategoryPackageById);
router.post('/admin/create/category/orderStatus',verifyAdminMid, craetePacakageCategory);
router.patch('/admin/edit/category/orderStatus/:id',verifyAdminMid, updateCategoryPackage);

export default router