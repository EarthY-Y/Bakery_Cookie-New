import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";


export const createStatus = async (req, res) => {
    try {
        const id = uuidv4()
        const {active, statusName, statusfor} = req.body
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);

        if(statusfor === "cart"){
            console.log("create cart");
            
            const results = await new Promise((resolve, reject)=> {
                db.query("INSERT INTO status_cart (status_cart_id, status_name, created_by ) VALUES(?, ?, ?)", [id, statusName, token.admin_id],
                        (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                })
            })
            // console.log("results",results);
            return res.status(200).json(results);
        }

        if(statusfor === "order"){
            console.log("create order");
            
            const results = await new Promise((resolve, reject)=> {
                db.query("INSERT INTO status_order (status_order_id, status_name, created_by ) VALUES(?, ?, ?)", [id, statusName, token.admin_id],
                        (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                })
            })
            // console.log("results",results);
            return res.status(200).json(results);
        }

    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}

export const getStatusOrder = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            //so.* ก็จริงเเต่สุดท้ายข้อมูลของ created_by,updated_by จะโดนอันใหม่ทับไป 
            db.query(`SELECT so.*, a_created.username as created_by, a_updated.username as updated_by FROM status_order so
                     LEFT JOIN admin a_created ON a_created.admin_id = so.created_by
                     LEFT JOIN admin a_updated ON a_updated.admin_id = so.updated_by`,
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

export const updateStatusOrderName = async (req, res) => {
    try {
        console.log("updateStatusOrderName");
        const id = req.params.id
        const {active, statusName} = req.body
        console.log(active, typeof(active));
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        let is_active = false
        if (active == "1") {
            is_active = true
        }

        const results = await new Promise((resolve, reject)=> {
            db.query("UPDATE status_order SET status_name = ?, is_active = ?,updated_by = ? WHERE status_order_id = ?", [statusName, is_active, token.admin_id, id],
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

export const getStatusOrderById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM status_order WHERE status_order_id = ?", [id],
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

export const updateStatusOrder = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const id = req.params.id
        const {status, skip} = req.body
        if(!skip){ //ถ้าหน้าส่ง skip มาก็จะไม่ตรวจสอบ duplicate
            const resultsDupilcateHistory = await new Promise((resolve, reject)=> {
                db.query("SELECT history_id FROM order_status_history WHERE orders_id = ? AND status_order_id = ? AND changed_by = ?",[id, status, token.admin_id],
                        (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                })
            })
            console.log(resultsDupilcateHistory);
            
            if(resultsDupilcateHistory[0]?.history_id){
                return res.status(400).json({ message: "เคยใช้สถานะนี้เเล้ว"})
            }
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("UPDATE orders SET status = ?, updated_by = ? WHERE orders_id = ?", [status, token.admin_id, id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        const resultsInsertHistory = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO order_status_history (history_id , orders_id, status_order_id, changed_by) VALUES (?, ?, ?, ?)",[uuidv4(), id, status, token.admin_id],
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