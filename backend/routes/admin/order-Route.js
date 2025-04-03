import express from "express";
import {
    getOrderslistWaitStatement,
    getOrderslistCheckOut,
    getOrderslistById,
    getOrdersById,
    getOrdersHistoryById,
    getOrdersAddressById,
    getStatusOrderslist,
    getStatusListForChangeOrders,
    updatePostCodeOrder,
    updateStatusOrder,
} from "../../controller/admin/orders.js"

import { getTokenPostTH,
    getTracking
} from "../../controller/thailandPost.js";

import { verifyAdminMid } from "../../middleware/authAdmin.js"

const router = express()
router.use(express.json());

router.get('/admin/get/orders/list/waitstatement', verifyAdminMid, getOrderslistWaitStatement);
router.get('/admin/get/orders/list/checkout', verifyAdminMid, getOrderslistCheckOut);
router.get('/admin/get/status/orders/list', verifyAdminMid, getStatusOrderslist);
router.get('/admin/get/order/by/status/name/:id', verifyAdminMid, getOrderslistById);
router.get('/admin/view/detail/order/:id', verifyAdminMid, getOrdersById);
router.get('/admin/view/detail/order/history/:id', verifyAdminMid, getOrdersHistoryById);
router.get('/admin/get/status/list/for/changeOrders', verifyAdminMid, getStatusListForChangeOrders);
router.get('/admin/get/order/address/:id', verifyAdminMid, getOrdersAddressById);
router.patch('/admin/update/postCode/order/:id', verifyAdminMid, updatePostCodeOrder);
router.patch('/admin/update/status/order/:id', verifyAdminMid, updateStatusOrder);
router.patch('/admin/get/tracking/:id', getTracking);

export default router