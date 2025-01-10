import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

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
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const updateStatusCratName = async (req, res) => {
    try {
        console.log("updateStatusCratName");
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
            db.query("UPDATE status_cart SET status_name = ?, is_active = ?, updated_by = ? WHERE status_cart_id = ?", [statusName, is_active, token.admin_id, id], 
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log("results",results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
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
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}