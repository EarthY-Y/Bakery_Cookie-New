import express from "express";
import {
    getListCategoryOrderStatus,
    getStatusOrderslist,
    craetePacakageCategory,
    updateCategoryStatus,
    getCategoryStatusById,
    deleteCategoryStatus
} from "../../controller/admin/categoryOrderStatus.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/get/list/category/orderStatus',verifyAdminMid, getListCategoryOrderStatus);
router.get('/admin/get/list/orderStatus/create',verifyAdminMid, getStatusOrderslist,);
router.get('/admin/get/category/orderStatus/:id',verifyAdminMid, getCategoryStatusById);
router.post('/admin/create/category/orderStatus',verifyAdminMid, craetePacakageCategory);
router.patch('/admin/edit/category/orderStatus/:id',verifyAdminMid, updateCategoryStatus);
router.patch('/admin/delete/category/status/:id',verifyAdminMid, deleteCategoryStatus);

export default router