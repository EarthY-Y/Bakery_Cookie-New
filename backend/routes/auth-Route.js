import express from "express";
import {LoginCutomer,
        LoginAdmin,
        logOutCustomer
} from "../controller/login.js"
import { verifyAdmin } from "../middleware/authAdmin.js";
import { verifyCustomer } from "../middleware/authUser.js";

const router = express.Router();
router.use(express.json());

router.post('/login', LoginCutomer);
router.post('/login/admin', LoginAdmin);
router.delete('/logOut', logOutCustomer);
router.get('/verifyAdmin', verifyAdmin);
router.get('/verifyCustomer', verifyCustomer);

export default router