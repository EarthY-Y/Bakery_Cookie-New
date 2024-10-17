import db from "../config/dataBase.js"

//เป็นการเช็ค การร้องขอเข้าถึง API ในส่วนของหลังบ้านซึ่งจะนำไปใช้กับการทำ Route API หลังบ้าน
export const verifyCustomer = async (req, res , next) => {
    console.log(req.session.id);
    if(!req.session.userId){
        return res.status(401).json({msg: "Please login to your account!"});
    }
    const id = req.session.id
    console.log(id);
    
    db.query(

        "SELECT customerId, userName, role_function, is_active FROM customer WHERE customerId = ?",
        [id], 

        (errr, results, fields) => {
            console.log(results);
            if(errr){
                console.log(errr)
                return res.status(400).json({ msg: "Bad Request" });
            }
            if(!results) return res.status(404).json({msg: "User not found"});
            req.username = results.userName;
            req.role_function = results.role_function;
            next();
        }
    )
}