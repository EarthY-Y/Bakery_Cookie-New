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
        if (authHeader && authHeader.startsWith('Bearer ')) {
            if (authHeader) {
                authToken = authHeader.split(' ')[1]
            }
            console.log(authToken)
            //เข้าถึง JWT ด้วยรหัสที่ตั้งไว้
            const userJWT = jwt.verify(authToken, process.env.JWT_SECRET) 
            console.log(userJWT)
            const [checkToken] = await db.query("SELECT customerId FROM customer WHERE customerId = ?",
                [userJWT], )
            if(!checkToken[0]){
                throw{ msg: "user not found" } //throw ลงไป catch
            }
            next();
        }

    } catch (err) {
        console.log('Error',err)
        res.status(500).send({ message: 'Server error' })
    }
}