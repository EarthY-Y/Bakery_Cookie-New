import db from "../config/dataBase.js"

export const verifyAdmin = async (req, res , next) => {
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
            const [checkToken] = await db.query("SELECT admin_id FROM admin WHERE admin_id = ?", //อนาคตต้องเพิ่มการเช็ค role ด้วยได้มาจาก 3 ตารางเชื่อมมกันเเต่จะ select เเค่ชื่อมาเช็ค
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