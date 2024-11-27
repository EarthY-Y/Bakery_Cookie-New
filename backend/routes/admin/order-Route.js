import express from "express";
import {
    getOrderslistWaitStatement,
    getOrderslistCheckOut,
    getOrdersById,
    getOrdersHistoryById
    // updateStatusOrder,
} from "../../controller/admin/orders.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"

const router = express()
router.use(express.json());

router.get('/admin/get/orders/list/waitstatement', verifyAdminMid, getOrderslistWaitStatement);
router.get('/admin/get/orders/list/checkout', verifyAdminMid, getOrderslistCheckOut);
router.get('/admin/view/detail/order/:id', verifyAdminMid, getOrdersById);
router.get('/admin/view/detail/order/history/:id', verifyAdminMid, getOrdersHistoryById);
// router.patch('/admin/upadate/status/order/:id', verifyAdminMid, updateStatusOrder);
export default router