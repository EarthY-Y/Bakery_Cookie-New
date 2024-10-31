import express from "express";
import {getProvice,
    getAmphure,
    getTambon
} from "../controller/address.js"
import { verifyCustomerMid } from "../middleware/authUser.js";

const router = express.Router();
router.use(express.json());

router.get('/getProvice', getProvice);
router.get('/amphure/:provinceId', getAmphure)
router.get('/tambon/:amphureId', getTambon)

export default router