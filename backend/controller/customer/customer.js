import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";
import { resolve } from "path";
import {createCart} from "./product.js"

//ส่งออก Function getCustomer ด้วย export
export const getCustomer = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM customer", (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get customer:", error);
        res.status(400).json({ message: "Error get customer", error});
    }
}

export const getCustomerById = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM customer WHERE customer_id = ?",[id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get customer by id:", error);
        return res.status(400).json({ message: "Error get customer by id", error });
    }
}

export const createCustomer = async (req, res) => {
    //gen id ให้ไม่ซ้ำกัน
    const id = uuidv4();
    //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
    console.log(req.body);
    
    const {phone_number, username, password, confPassword, f_name, l_name} = req.body;
    
    if(password !== confPassword) return res.status(400).json({message: "Password not match"});
    //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
    const hashPassword = await argon2.hash(password); //function hash(password, options) option เช่น ขนาด รูปเบบ เเละการกินพื้นที่ ต่างๆ
    try {
        const response = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO customer (customer_id, phone_number, f_name, l_name, username, password, is_active) VALUES(?, ?, ?, ?, ?, ?, ?)",
                [id, phone_number, f_name, l_name, username, hashPassword, "Y"],  (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            )
        })

        await createCart(id)
        console.log(response);
        res.status(201).json({status: "success",message: "User created successfully"});
        
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(400).json({ message: "Error creating customer", error });
    }
}

export const updateCustomer = (req, res) => {
    
}

export const deleteCustomer = (req, res) => {
    
}

export const createAddress = async (req, res) => {
    try {
        const id = uuidv4()
        const {tambonsId, amphuresId, provincesId, houseNo, postCode} = req.body
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO address (addressId, created_by, houesNo, province_id, amphure_id, tambon_id, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [id, authToken.customerId, houseNo, provincesId, amphuresId, tambonsId, postCode ],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}
