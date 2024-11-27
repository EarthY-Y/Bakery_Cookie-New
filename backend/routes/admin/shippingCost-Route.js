import express from "express";
import multer from 'multer'
import {
    getShipping, 
    getShippingPackage,
    getShippingById, 
    createShipping, 
    updateShipping, 
    deleteShipping
} from "../../controller/admin/shippingCost.js"
import { verifyAdminMid } from "../../middleware/authAdmin.js"
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

const router = express()
router.use(express.json());

router.get('/admin/get/list/shipping',verifyAdminMid, getShipping);
router.get('/admin/get/get/shipping/by/:id',verifyAdminMid, getShippingById);
router.get('/admin/get/shipping/package',verifyAdminMid, getShippingPackage);
router.post('/admin/shipping/create', verifyAdminMid, createShipping);
router.patch('/admin/shipping/update/:id',verifyAdminMid, updateShipping);
router.delete('/admin/shipping/delete/:id',verifyAdminMid, deleteShipping);


export default router