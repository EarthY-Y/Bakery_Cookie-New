import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();
export const passToken = async(token) => {
    const secretKey = process.env.JWT_SECRET;
    try {
        let authToken = ""
        if(!token){
            return res.status(403).json({message : "ไม่มี Token" })
        }
        else if (token && token.startsWith('Bearer ')) {
            if (token) {
                authToken = token.split(' ')[1]
                //เข้าถึง JWT ด้วยรหัสที่ตั้งไว้
                const userJWT = jwt.verify(authToken, secretKey) 
                console.log('passAuth userJWT',userJWT)
                return userJWT
            }
        }
    } catch (err) {
        console.log(err);
    }
}