import express from "express";
import {Login,
        LINELoginCutomer
} from "../controller/login.js"
import { verifyAdmin } from "../middleware/authAdmin.js";
import { verifyCustomer } from "../middleware/authUser.js";

const router = express.Router();
router.use(express.json());

router.post('/login', Login);
router.post('/login-line/customer', LINELoginCutomer);
router.get('/verifyAdmin', verifyAdmin);
router.get('/verifyCustomer', verifyCustomer);

export default router