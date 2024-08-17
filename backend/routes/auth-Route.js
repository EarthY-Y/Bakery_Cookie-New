import express from "express";
import {Login,
    checkLogin,
    logOut
} from "../controller/auth.js"

const router = express.Router();
router.use(express.json());

router.post('/login', Login);
router.get('/checkLogin', checkLogin);
router.delete('/logOut', logOut);


export default router