import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const getOrderslist = async (req, res) => {
    try {
        // const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        // const authToken = await passToken(authHeader)
        // if(!authToken){
        //     return res.status(404).json({ message: "User not found" });
        // }
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM orders",
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log("results",results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}
