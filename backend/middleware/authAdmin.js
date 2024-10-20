import db from "../config/dataBase.js"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { passToken } from "./passAuth.js";

dotenv.config();
//ใช้ verify ฝั่งหน้าบ้านเเละส่งเเละส่ง res เพื่อตอบกลับ
export const verifyAdmin = async (req, res , next) => {
    //token with Local storage 
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        
        const authToken = await passToken(authHeader)

        db.query("SELECT admin_id FROM admin WHERE admin_id = ?", //อนาคตต้องเพิ่มการเช็ค role ด้วยได้มาจาก 3 ตารางเชื่อมมกันเเต่จะ select เเค่ชื่อมาเช็ค
            [authToken.admin_id], 
            (err, results) => {
                console.log('results ',results);
                if (results.length === 0) {
                    return res.status(404).json({ msg: "User not found" });
                }
                res.status(200).json({results, isAdmin: "admin" });
                next()
        })
        

    } catch (err) {
        console.log('Error',err)
        res.status(500).send({ message: 'Server error' })
    }
}

//
export const verifyAdminMid = async (req, res , next) => {
    //token with Local storage 
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ msg: "User not found" });
        }

        db.query("SELECT admin_id FROM admin WHERE admin_id = ?", //อนาคตต้องเพิ่มการเช็ค role ด้วยได้มาจาก 3 ตารางเชื่อมมกันเเต่จะ select เเค่ชื่อมาเช็ค
            [authToken.admin_id], 
            (err, results) => {
                console.log('results ',results);
                if (results.length === 0) {
                    return res.status(404).json({ msg: "User not found" });
                }
                next()
        })
        

    } catch (err) {
        console.log('Error',err)
        res.status(500).send({ message: 'Server error' })
    }
}