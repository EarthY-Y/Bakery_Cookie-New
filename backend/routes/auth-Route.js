import express from "express";
import {Login,
        logOut
} from "../controller/auth.js"

const router = express.Router();
router.use(express.json());

router.post('/login', Login);
router.delete('/logOut', logOut);


export default router