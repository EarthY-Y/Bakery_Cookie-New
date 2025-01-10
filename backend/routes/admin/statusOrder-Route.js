import express from "express";
import {
    getStatusOrder,
    createStatus,
    getStatusOrderById,
    updateStatusOrderName,


} from "../../controller/admin/statusOrder.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"

const router = express()
router.use(express.json());

router.get('/admin/get/status/order', verifyAdminMid, getStatusOrder);
router.post('/admin/create/status', verifyAdminMid, createStatus);
router.get('/admin/get/status/order/:id', verifyAdminMid, getStatusOrderById);
router.patch('/admin/update/status/order/:id', verifyAdminMid, updateStatusOrderName);

export default router