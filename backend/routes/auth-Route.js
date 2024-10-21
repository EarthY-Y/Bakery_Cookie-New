import express from "express";
import {Login,
        logOut
} from "../controller/auth.js"
import { verifyAdmin } from "../middleware/authAdmin.js";
import { verifyCustomer } from "../middleware/authUser.js";

const router = express.Router();
router.use(express.json());

router.post('/login', Login);
router.delete('/logOut', logOut);
router.get('/verifyAdmin', verifyAdmin);
router.get('/verifyCustomer', verifyCustomer);

export default router