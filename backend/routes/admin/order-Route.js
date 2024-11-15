import express from "express";
import {
    getOrderslist
} from "../../controller/admin/orders.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"

const router = express()
router.use(express.json());

router.get('/admin/get/orders/list', verifyAdminMid, getOrderslist);

export default router