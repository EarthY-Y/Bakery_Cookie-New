import express from "express";
import {
    getOrderslistWaitStatement,
    getOrderslistCheckOut,
} from "../../controller/customer/ordersTracking.js"

import { verifyCustomerMid } from "../../middleware/authUser.js"

const router = express()
router.use(express.json());

router.get('/customers/get/orders/list/waitstatement', verifyCustomerMid, getOrderslistWaitStatement);
router.get('/customers/get/orders/list/inprocess', verifyCustomerMid, getOrderslistCheckOut);
export default router