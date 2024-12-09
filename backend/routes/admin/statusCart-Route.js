import express from "express";
import {
    getStatusCart,
    getStatusCartById,
    updateStatusCratName,

} from "../../controller/admin/statusCart.js"

import { verifyAdminMid } from "../../middleware/authAdmin.js"

const router = express()
router.use(express.json());

router.get('/admin/get/status/cart', verifyAdminMid, getStatusCart);
router.get('/admin/get/status/cart/:id', verifyAdminMid, getStatusCartById);
router.patch('/admin/update/status/cart/:id', verifyAdminMid, updateStatusCratName);
export default router