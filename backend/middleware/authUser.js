import db from "../config/dataBase.js"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();
//เป็นการเช็ค การร้องขอเข้าถึง API ในส่วนของหลังบ้านซึ่งจะนำไปใช้กับการทำ Route API หลังบ้าน
export const verifyCustomer = async (req, res , next) => {
    //token with Local storage 
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        let authToken = ""
        if(!authHeader){
            return res.status(403).json({message : "ไม่มี Token" })
        }
        else if (authHeader && authHeader.startsWith('Bearer ')) {
            if (authHeader) {
                authToken = authHeader.split(' ')[1]
            }
            console.log('authToken is',authToken)
            //เข้าถึง JWT ด้วยรหัสที่ตั้งไว้
            const userJWT = jwt.verify(authToken, process.env.JWT_SECRET) 
            console.log('userJWT is',userJWT)
            await db.query("SELECT customer_id FROM customer WHERE customer_id = ?",
                [userJWT.customerId],
            (err, results) => {
                console.log('results',results);
                if (results.length === 0) {
                    console.log('in length = 0');
                    return res.status(404).json({ msg: "User not found" });
                }
                return res.json({results, isCustomer: "customer" });
            })
        }

    } catch (err) {
        console.log('Error',err)
        res.status(500).send({ msg: 'Server error' })
    }
}