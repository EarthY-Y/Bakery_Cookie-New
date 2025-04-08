import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const passToken = (token) => {
    const secretKey = process.env.JWT_SECRET
    if (!token) {
        throw new Error('ไม่มี Token')
    }
    if (token.startsWith('Bearer ')) {
        const authToken = token.split(' ')[1]
        try {
            const userJWT = jwt.verify(authToken, secretKey)
            return userJWT
        } catch (err) {
            throw new Error({message:'Token ไม่ถูกต้อง'})
        }
    } else {
        throw new Error({message :'Token ไม่ถูกต้อง'})
    }
}

// export const passAuth = (req, res, next) => {
//     const token = req.headers.authorization
//     try {
//         const userJWT = passToken(token)
//         req.user = userJWT
//         next()
//     } catch (err) {
//         res.status(401).json({ message: err.message })
//     }
// }
// export const passToken = (token) => {
//     const secretKey = process.env.JWT_SECRET;
//     try {
//         let authToken = ""
//         if(!token){
//             return res.status(403).json({message : "ไม่มี Token" })
//         }
//         else if (token && token.startsWith('Bearer ')) {
//             authToken = token.split(' ')[1]
//             //เข้าถึง JWT ด้วยรหัสที่ตั้งไว้
//             const userJWT = jwt.verify(authToken, secretKey) //ถ้า verify ไม่ผ่านจะ validate ยังไงให้รู้ว่า token เป็นของปลอมหรือไม่ตรง
//             return userJWT
            
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }