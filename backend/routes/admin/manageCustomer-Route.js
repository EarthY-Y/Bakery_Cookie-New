import express from "express";
import {
    getListCustomer,
    getListCustomerById,
    getListCustomerAddressById,
    updateCustomerActiveById
} from "../../controller/admin/manageCustomer.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/get/manage/customer/list',verifyAdminMid, getListCustomer);
router.get('/admin/get/manage/customer/by/:id',verifyAdminMid, getListCustomerById);
router.get('/admin/get/manage/customer/address/by/:id',verifyAdminMid, getListCustomerAddressById);
router.patch('/admin/get/manage/customer/active/by/:id',verifyAdminMid, updateCustomerActiveById);

export default router