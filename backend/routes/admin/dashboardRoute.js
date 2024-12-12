import express from "express";
import {
    getAmountOrders,
    getSales,
    getNewCustomer,
    getGrowthUpSales,
    getSalesPerMonth,
    getSalesRankPerMonth,
} from "../../controller/admin/dashboard.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express.Router();
router.use(express.json());

router.get('/admin/dashboard/get/amout/order',verifyAdminMid, getAmountOrders);
router.get('/admin/dashboard/get/sales',verifyAdminMid, getSales);
router.get('/admin/dashboard/get/new/customer',verifyAdminMid, getNewCustomer);
router.get('/admin/dashboard/get/growth/sales',verifyAdminMid, getGrowthUpSales);
router.get('/admin/dashboard/get/sales/per/mouth',verifyAdminMid, getSalesPerMonth);
router.get('/admin/dashboard/get/sales/rank/per/mouth',verifyAdminMid, getSalesRankPerMonth);

export default router