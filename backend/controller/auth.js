import db from "../config/dataBase.js"
import argon2 from "argon2";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();
//สร้างขึ้นเพื่อเวลาสร้าง seesion ตอน login เพื่อเอาไปใช้ในการตรวจสอบการ login ในหน้าต่างๆ 
export const Login = async (req, res) =>{
    console.log("req.body = ",req.body);
    const {userName,passWord} = req.body
    try {
        await db.query( //ใช้ const [result] มารับ response ไม่ได้เพราะไม่ได้ใช้ middleware express.json ที่จะ parse JSON request body ทำให้เข้าถึง req.body ได้
            //สร้าง Query มาทำงาน 
            "SELECT customer_id, username, password, is_active FROM customer WHERE username = ?", userName, 
            //results คือค่าที่เราจะได้จากการไป get มา
            async(err, results) => {
                console.log('res from customer ', results);
                if (results.length === 0) { //เช็คค่าว่างต่างๆ
                    await db.query(
                        "SELECT admin_id, userName, passWord, is_active FROM admin WHERE userName = ?", userName, 
                        async (err, resultsAdmin) => {
                            console.log('res from admin ', resultsAdmin);
                            if (resultsAdmin.length === 0) {
                                return res.status(404).json({ msg: "User not found" });
                            }
                            const user = resultsAdmin[0];
                            console.log(user);
                            console.log(`results ที่ได้มาคือ ${JSON.stringify(user, null, 2)}`);
                            
                            const match = await argon2.verify(user.passWord, passWord);
                            if (!match) {
                                return res.status(400).json({ msg: "Wrong Password" });
                            }
                            const token = jwt.sign({ admin_id: user.admin_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                            res.status(200).json({msg:"login complete", token: token, role: "admin"});
                        }
                    )
                }else if(results){
                    if (err) return res.status(500).json({ msg: "Database error" });
                    if (results.length === 0) {
                        return res.status(404).json({ msg: "User not found" });
                    }
                    const user = results[0];
                    console.log(`results ที่ได้มาคือ ${JSON.stringify(user, null, 2)}`);
                    const match = argon2.verify(user.password, passWord);
                    if (!match) {
                        return res.status(400).json({ msg: "Wrong Password" });
                    }
                    //ทำงานจากการที่ Frontend login เข้ามา
                    const token = jwt.sign({ customerId: user.customer_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.status(200).json({msg:"login complete", token: token, role: "user"}); //ใน 1 Function ถ้ามี res หรือ return มากกว่า 1 ตัวควรหาไรคุมให้มัน
                }
            }
        )
    } catch (err) {
        console.log(err);
    }
}

export const logOut = (req, res) =>{
    
}