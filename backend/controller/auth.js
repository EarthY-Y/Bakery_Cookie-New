import db from "../config/dataBase.js"
import argon2 from "argon2";

export const Login = async (req, res) =>{

    console.log(req.body);
    
    const username = req.body.username
    db.query(
        //สร้าง Query มาทำงาน 
        "SELECT username, role_function, id, password FROM customer WHERE username = ?",
        [username], 
        //results คือค่าที่เราจะได้จากการไป get มา
        async (err, results) => {
            console.log(results);
            if (err) {
                console.log(err);
                return res.status(400).send({ msg: "Error occurred" });
            }
    
            // ตรวจสอบว่าพบ user หรือไม่
            if (results.length === 0) {
                return res.status(404).json({ msg: "User not found" });
            }
            
            //เอาค่า results ตำเเหน่งที่ 0 มา
            const user = results[0];
            //JSON.stringify เเปลง object ให้เป็น json
            console.log(`results ที่ได้มาคือ ${JSON.stringify(user, null, 2)}`);
            
            // ตรวจสอบรหัสผ่าน 
            const match = await argon2.verify(user.password, req.body.password);
            if (!match) {
                return res.status(400).json({ msg: "Wrong Password" });
            }
    
            // ตั้งค่า session หรือการสร้าง seesion โดยใช้ filed id
            req.session.userId = user.id;
            console.log(req.session.userId);
            
            
            //เเค่ให้เเสดงใน json
            const id = user.id;
            const username = user.username;
            const role_function = user.role_function;
    
            res.status(200).json({msg:"login complete" /*id, username, role_function*/ });
        }
    )

}

//เอาไปใช้กับ fontend
export const checkLogin = async (req, res) =>{
    
    console.log(`checklogin id = ${req.session.userId}`);
    ///ถ้าไม่มี session user นี้ เป็นเหมือนสิทธิ์การเข้าถึง
    if(!req.session.userId){
        return res.status(401).json({msg: "Please login to your account!"});
    }
    const userId = req.session.userId
    console.log(userId);
    
    db.query(
        //"SELECT TOP 1 1 FROM customer WHERE id = ?"  หา id ถ้าเจอ 1 ตัวให้ มีค่า = 1 
        "SELECT username, role_function, id FROM customer WHERE id = ?",
        [userId], 
        //results คือค่าที่เราจะได้จากการไป get มา
        async (errr, results, fields) => {
            console.log(results);
            if(errr){
                console.log(errr)
                return res.status(400),send();
            }
            if(!results) return res.status(404).json({msg: "User not found"});
            console.log(results)
            res.status(200).json(results);
        }
    )

}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "unlogout "});
        res.status(200).json({msg: "logout"});
    });
}