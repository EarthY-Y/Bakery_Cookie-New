import express from "express";
import {
    getProvice,
    getAmphure,
    getTambon
} from "../controller/address.js"
import { verifyCustomerMid } from "../middleware/authUser.js";

const router = express.Router();
router.use(express.json());

router.get('/customers/get/provice', getProvice);
router.get('/customers/amphure/:provinceId', getAmphure)
router.get('/customers/tambon/:amphureId', getTambon)

export default router