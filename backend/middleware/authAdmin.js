import db from "../config/dataBase.js"

export const verifyAdmin = async (req, res , next) => {
    console.log(req.session.userId);
    ///ถ้าไม่มี session user นี้ เป็นเหมือนสิทธิ์การเข้าถึง
    if(!req.session.userId){
        return res.status(401).json({msg: "Please login to your account!"});
    }
    const username = req.session.userName
    console.log(userId);
    
    db.query(
        "SELECT admin_id, userName, role_function FROM admin WHERE userName = ?",
        [username], 

        (errr, results, fields) => {
            console.log(results);
            if(errr){
                console.log(errr)
                return res.status(400).json({ msg: "Bad Request" });
            }
            if(!results) return res.status(404).json({msg: "User not found"});
            //ต้อง เช็คผ่าน seesion ที่ได้จาก auth ที่ table admin
            if(results.role_function === "admin") return res.status(403).json({msg: "You ain't got no right"});
            req.username = results.userName;
            req.role_function = results.role_function;
            next();
        }
    )
}