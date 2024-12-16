import express from "express";
import {
    getAllAddressCustomer,
    getAddressByAddressId,
    updateAddressByAddressId,
    deleteAddressCustomer
} from "../../controller/customer/addressCutomer.js"
import { verifyCustomerMid } from "../../middleware/authUser.js";

const router = express.Router();
router.use(express.json());

router.get('/customers/get/all/address', verifyCustomerMid, getAllAddressCustomer);
router.get('/customers/get/address/:id', verifyCustomerMid, getAddressByAddressId);
router.patch('/customers/update/address/by/:id', verifyCustomerMid, updateAddressByAddressId);
router.patch('/customers/delete/address', verifyCustomerMid, deleteAddressCustomer);
export default router