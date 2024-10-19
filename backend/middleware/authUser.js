import db from "../config/dataBase.js"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { passToken } from "./passAuth.js";

dotenv.config();
//เป็นการเช็ค การร้องขอเข้าถึง API ในส่วนของหลังบ้านซึ่งจะนำไปใช้กับการทำ Route API หลังบ้าน
export const verifyCustomer = async (req, res , next) => {
    //token with Local storage 
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        console.log("authHeader", authHeader);

        const authToken = await passToken(authHeader)
        console.log('authToken',authToken)

        await db.query("SELECT customer_id FROM customer WHERE customer_id = ?",
            [authToken.customerId],
        (err, results) => {
            console.log('results',results);
            if (results.length === 0) {
                console.log('in length = 0');
                return res.status(404).json({ msg: "User not found" });
            }
            return res.json({results, isCustomer: "customer" });
        })
        

    } catch (err) {
        console.log('Error',err)
        res.status(500).send({ msg: 'Server error' })
    }
}