import express from "express";
import {
    getAllAddressCustomer,
} from "../../controller/customer/addressCutomer.js"
import { verifyCustomerMid } from "../../middleware/authUser.js";

const router = express.Router();
router.use(express.json());

router.get('/customers/get/all/address', verifyCustomerMid, getAllAddressCustomer);

export default router