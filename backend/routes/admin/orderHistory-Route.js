import express from "express";
import {
    getOrderslistSuccessStatement,
    getOrderslistHistoryCancel,
    getOrdersById,
    getStatusOrdersHistoryById
} from "../../controller/admin/ordersHistory.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"

const router = express()
router.use(express.json());

router.get('/admin/get/orders/history/list/success', verifyAdminMid, getOrderslistSuccessStatement);
router.get('/admin/get/orders/list/history/cancel', verifyAdminMid, getOrderslistHistoryCancel);
router.get('/admin/view/detail/orderhistory/:id', verifyAdminMid, getOrdersById);
router.get('/admin/view/detail/status/order/history/:id', verifyAdminMid, getStatusOrdersHistoryById);
export default router