import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";


export const createStatus = async (req, res) => {
    try {
        const id = uuidv4()
        const {statusId, statusName, statusfor} = req.body
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
            db.query("SELECT so.*, a_created.username as created_by, a_updated.username as updated_by FROM status_order so"+
                    " LEFT JOIN admin a_created ON a_created.admin_id = so.created_by"+
                    " LEFT JOIN admin a_updated ON a_updated.admin_id = so.updated_by",
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

export const getStatusCart = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT sc.*, a_created.username as created_by, a_updated.username as updated_by FROM status_cart sc"+
                " LEFT JOIN admin a_created ON a_created.admin_id = sc.created_by"+
                " LEFT JOIN admin a_updated ON a_updated.admin_id = sc.updated_by",
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
        const {statusName} = req.body
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const results = await new Promise((resolve, reject)=> {
            db.query("UPDATE status_order SET status_name = ?, updated_by = ? WHERE status_order_id = ?", [statusName, token.admin_id, id],
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

export const updateStatusCratName = async (req, res) => {
    try {
        console.log("updateStatusCratName");
        const id = req.params.id
        const {statusName} = req.body
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const results = await new Promise((resolve, reject)=> {
            db.query("UPDATE status_cart SET status_name = ?, updated_by = ? WHERE status_cart_id = ?", [statusName, token.admin_id, id], 
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

export const getStatusCartById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM status_cart WHERE status_cart_id = ?", [id],
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
        const {status} = req.body
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