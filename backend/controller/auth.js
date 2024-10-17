import db from "../config/dataBase.js"
import argon2 from "argon2";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();
//สร้างขึ้นเพื่อเวลาสร้าง seesion ตอน login เพื่อเอาไปใช้ในการตรวจสอบการ login ในหน้าต่างๆ 
export const Login = async (req, res) =>{
    console.log(req.body);
    const username = req.body.username
    try {
        await db.query(
            //สร้าง Query มาทำงาน 
            "SELECT customerId, username, role_function, password, status FROM customer WHERE username = ?",
            [username], 
            //results คือค่าที่เราจะได้จากการไป get มา
            async (err, results) => {
                console.log(results);
                if (results.length === 0) {
                    return res.status(404).json({ msg: "User not found" });
                }
                const user = results[0];
                console.log(user);
                console.log(`results ที่ได้มาคือ ${JSON.stringify(user, null, 2)}`);
                const match = await argon2.verify(user.password, req.body.password);
                if (!match) {
                    return res.status(400).json({ msg: "Wrong Password" });
                }
                //ทำงานจากการที่ Frontend login เข้ามา
                const token = jwt.sign({ customerId: user.customerId }, process.env.JWT_SECRET, { expiresIn: '1h' });
                //save session จาก customerId เพื่อเอาไว้ใช้เช็คสิทธิในการเข้าถึง
        
                res.status(200).json({msg:"login complete", token});
            }
        )
    } catch (err) {
        console.log(err);
        if(res.status(400)){
            return res.status(400).json({ msg: "Bad Request" });
        }
        else if(res.status(403)){
            return res.status(403).json({ msg: "user or password is dont corrent" });
        }
    }
}

export const LoginRoleAdmin = async (req, res) =>{
    console.log(req.body);
    const username = req.body.username
    try {
        await db.query(
            "SELECT admin_id, userName, passWord, role_function, is_active FROM admin WHERE userName = ?",
            [username], 
            async (err, results) => {
                console.log(results);
                if (results.length === 0) {
                    return res.status(404).json({ msg: "User not found" });
                }
                const user = results[0];
                console.log(user);
                console.log(`results ที่ได้มาคือ ${JSON.stringify(user, null, 2)}`);
                
                const match = await argon2.verify(user.passWord, req.body.password);
                if (!match) {
                    return res.status(400).json({ msg: "Wrong Password" });
                }
                req.session.admin_id = user.admin_id;
                // req.session.role = user.role_function; //set role จาก role_function  
                console.log(req.session.id);

                const token = jwt.sign({ customerId: user.admin_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({msg:"login complete", token /*id, username, role_function*/ });
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Bad Request" });
    }
}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "unlogout "});
        res.status(200).json({msg: "logout"});
    });
}