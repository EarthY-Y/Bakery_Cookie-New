import db from "../config/dataBase.js"
import argon2 from "argon2";
//สร้างขึ้นเพื่อเวลาสร้าง seesion ตอน login เพื่อเอาไปใช้ในการตรวจสอบการ login ในหน้าต่างๆ 
export const Login = async (req, res) =>{
    console.log(req.body);
    const username = req.body.username
    db.query(
        //สร้าง Query มาทำงาน 
        "SELECT customerId, userName, role_function, password, is_active FROM customer WHERE userName = ?",
        [username], 
        //results คือค่าที่เราจะได้จากการไป get มา
        async (err, results) => {
            console.log(results);
            if (err) {
                console.log(err);
                return res.status(400).json({ msg: "Bad Request" });
            }
    
            // ตรวจสอบว่าพบ user หรือไม่
            if (results.length === 0) {
                return res.status(404).json({ msg: "User not found" });
            }
            
            //เอาค่า results ตำเเหน่งที่ 0 มา
            const user = results[0];
            console.log(user);
            
            //JSON.stringify เเปลง object ให้เป็น json
            console.log(`results ที่ได้มาคือ ${JSON.stringify(user, null, 2)}`);
            
            // ตรวจสอบรหัสผ่าน 
            const match = await argon2.verify(user.password, req.body.password);
            if (!match) {
                return res.status(400).json({ msg: "Wrong Password" });
            }
    
            // ตั้งค่า session หรือการสร้าง seesion id โดยใช้ filed id
            req.session.id = user.customerId; //set id session จาก customerId เพื่อเอาไว้ใช้เชํคสิทะฺในการเข้าถึง
            console.log(req.session.id);
            
            
            //เเค่ให้เเสดงใน json
            // const username = user.username;
            // const role_function = user.role_function;
    
            res.status(200).json({msg:"login complete" /*id, username, role_function*/ });
        }
    )
}

export const LoginRoleAdmin = async (req, res) =>{
    console.log(req.body);
    const username = req.body.username
    db.query(
        "SELECT admin_id, userName, passWord, role_function, is_active FROM admin WHERE userName = ?",
        [username], 
        async (err, results) => {
            console.log(results);
            if (err) {
                console.log(err);
                return res.status(400).json({ msg: "Bad Request" });
            }
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
            req.session.id = user.admin_id;
            // req.session.role = user.role_function; //set role จาก role_function  
            console.log(req.session.id);
    
            //เเค่ให้เเสดงใน json
            // const username = user.username;
            // const role_function = user.role_function;
    
            res.status(200).json({msg:"login complete" /*id, username, role_function*/ });
        }
    )
}


//เอาไปใช้กับ fontend
export const checkLogin = async (req, res) =>{
    
    console.log(`checklogin id = ${req.session.username}`);
    ///ถ้าไม่มี session user นี้ เป็นเหมือนสิทธิ์การเข้าถึง
    if(!req.session.username){
        return res.status(401).json({msg: "Please login to your account!"});
    }
    const username = req.session.username
    console.log(userId);
    
    db.query(
        //"SELECT TOP 1 1 FROM customer WHERE userName = ?"  หา userName ถ้าเจอ 1 ตัวให้ มีค่า = 1 
        "SELECT userName, role_function FROM customer WHERE userName = ?",
        [username], 
        //results คือค่าที่เราจะได้จากการไป get มา
        async (errr, results, fields) => {
            console.log(results);
            if(errr){
                console.log(errr)
                return res.status(400).send()
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