import express from "express";
import {
    getListCategoryPackage,
    craetePacakageCategory,
    updateCategoryPackage,
    getCategoryPackageById,
} from "../../controller/admin/categoryPackage.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/get/list/category/package',verifyAdminMid, getListCategoryPackage);
router.get('/admin/get/category/package/:id',verifyAdminMid, getCategoryPackageById);
router.post('/admin/create/category/package',verifyAdminMid, craetePacakageCategory);
router.patch('/admin/edit/category/package/:id',verifyAdminMid, updateCategoryPackage);

export default router