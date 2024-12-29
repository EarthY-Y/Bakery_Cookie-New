import express from "express";
import {
    getOrderslistWaitStatement,
    getOrderslistCheckOut,
    getOrderslistCancel,
    getOrderslistFinish,
    getOrdersTrackingById,
    getOrdersTrackingHistoryById,
    getOrdersProductTrackingById,
    getOrderTrackingAddress,
    cancleOrder
} from "../../controller/customer/ordersTracking.js"

import { verifyCustomerMid } from "../../middleware/authUser.js"

const router = express()
router.use(express.json());

router.get('/customers/get/orders/list/waitstatement', verifyCustomerMid, getOrderslistWaitStatement);
router.get('/customers/get/orders/list/inprocess', verifyCustomerMid, getOrderslistCheckOut);
router.get('/customers/get/orders/list/cancel', verifyCustomerMid, getOrderslistCancel);
router.get('/customers/get/orders/list/finish', verifyCustomerMid, getOrderslistFinish);
router.get('/customers/get/detail/order/by/:id', verifyCustomerMid, getOrdersTrackingById);
router.get('/customers/get/history/order/by/:id', verifyCustomerMid, getOrdersTrackingHistoryById);
router.get('/customers/get/order/product/by/:id', verifyCustomerMid, getOrdersProductTrackingById);
router.get('/customers/get/order/address/tracking/by/:id', verifyCustomerMid, getOrderTrackingAddress);
router.patch('/customers/cancle/order/product/by/:id', verifyCustomerMid, cancleOrder);
export default router