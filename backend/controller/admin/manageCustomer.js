import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";

export const getListCustomer = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT customer_id, phone_number, f_name, l_name, username, is_active, created_at FROM customer`,
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล_category:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const getListCustomerById = async (req, res) => {
    try {
        const id = req.params.id
        // console.log(id);
        
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT * FROM customer `,
                    [id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log(results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล_category:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const getListCustomerAddressById = async (req, res) => {
    try {
        const id = req.params.id
        // console.log(id);
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT a.houseNo, a.zip_code, t.tambon_nameTH, ap.amphure_nameTH, p.province_nameTH FROM address a
                      LEFT JOIN tambon t ON t.tambon_id = a.tambon_id
                      LEFT JOIN amphure ap ON ap.amphure_id = a.amphure_id
                      LEFT JOIN province p ON p.province_id = a.province_id
                      WHERE created_by = ?`,
                    [id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log(results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล_category:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const updateCustomerActiveById = async (req, res) => {
    try {
        const id = req.params.id
        const {active} = req.body
        // console.log(id);
        let is_active = false
        if (active == "1") {
            is_active = true
        } 
        const results = await new Promise((resolve, reject)=> {
            db.query(`UPDATE customer SET is_active = ? WHERE customer_id = ?`,
                    [is_active, id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log(results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล_category:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

