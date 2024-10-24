import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

//ส่งออก Function getCustomer ด้วย export
export const getCustomer = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM customer", (err, results) => {
                if (err) return reject(err);
                resolve(results);
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get customer:", error);
        res.status(400).json({ message: "Error get customer", error: error.message });
    }
}

export const getCustomerById = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM customer WHERE id = ?", (err, results) => {
                if (err) return reject(err);
                resolve(results);
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get customer by id:", error);
        res.status(400).json({ message: "Error get customer by id", error: error.message });
    }
}

export const createCustomer = async (req, res) => {
    //gen id ให้ไม่ซ้ำกัน
    const id = uuidv4();
    //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
    const {phone_number, username, password, confPassword, f_name, l_name, is_active} = req.body;
    
    if(password !== confPassword) return res.status(400).json({message: "Password not match"});
    //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
    const hashPassword = await argon2.hash(password); //function hash(password, options) option เช่น ขนาด รูปเบบ เเละการกินพื้นที่ ต่างๆ
    try {
        const results = await new Promise((resolvem, reject) => {
            db.query(
                "INSERT INTO customer (customer_id, phone_number, f_name, l_name, username, password, is_active) VALUES(?, ?, ?, ?, ?, ?, ?)",
                [id, phone_number, f_name, l_name, username, hashPassword, "Y"],  (err, results) => {
                    if (err) return reject(err);
                    resolvem({message: "Register complete", results});
                }
            )
        })

        return res.status(201).json(results.message); 
    
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(400).json({ message: "Error creating customer", error: error.message });
    }
}

export const updateCustomer = (req, res) => {
    
}

export const deleteCustomer = (req, res) => {
    
}

