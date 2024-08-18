import db from "../config/dataBase.js"

export const verifyAdmin = async (req, res , next) => {
    console.log(req.session.userId);
    ///ถ้าไม่มี session user นี้ เป็นเหมือนสิทธิ์การเข้าถึง
    if(!req.session.userId){
        return res.status(401).json({msg: "Please login to your account!"});
    }
    const userId = req.params.userId
    console.log(userId);
    
    db.query(
        "SELECT username, role_function, id FROM customer WHERE id = ?",
        [userId], 

        (errr, results, fields) => {
            console.log(results);
            if(errr){
                console.log(errr)
                return res.status(400),send();
            }
            if(!results) return res.status(404).json({msg: "User not found"});
            if(results.role_function === "admin") return res.status(403).json({msg: "You ain't got no right"});
            req.userId = results.id;
            req.role_function = results.role_function;
            next();
        }
    )
}