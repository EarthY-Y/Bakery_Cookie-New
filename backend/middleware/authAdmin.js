import db from "../config/dataBase.js"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();
export const verifyAdmin = async (req, res , next) => {
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
            console.log('authToken',authToken)
            //เข้าถึง JWT ด้วยรหัสที่ตั้งไว้
            const userJWT = jwt.verify(authToken, process.env.JWT_SECRET) 
            console.log('userJWT',userJWT)
            await db.query("SELECT admin_id FROM admin WHERE admin_id = ?", //อนาคตต้องเพิ่มการเช็ค role ด้วยได้มาจาก 3 ตารางเชื่อมมกันเเต่จะ select เเค่ชื่อมาเช็ค
                [userJWT.admin_id], 
            (err, results) => {
                console.log('results ',results);
                if (results.length === 0) {
                    return res.status(404).json({ msg: "User not found" });
                }
                return res.json({results, isAdmin: "admin" });
            })
        }

    } catch (err) {
        console.log('Error',err)
        res.status(500).send({ message: 'Server error' })
    }
}