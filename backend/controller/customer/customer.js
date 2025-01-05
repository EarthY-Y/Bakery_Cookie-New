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
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM customer WHERE customer_id = ?",[authToken.customerId], (err, result) => {
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
    const phoneNumber = phone_number.padStart(10, '0'); //padStart จะเพิ่มสิ่งที่เราต้องการเข้าไปเเละจะเติมเข้าไปจนกว่าจะครบตามที่เราต้องการในที่นี้คือ เติม 0 ไปจนครบ 10 ตัว
    const resultsAdmin = await new Promise((resolve, reject) => {
        db.query("SELECT admin_id, userName, passWord, is_active FROM admin WHERE userName = ?", username, (err, resultsAdmin) => {
            if (err) return reject(err);
            resolve(resultsAdmin);
        });
    });

    if(resultsAdmin.length !== 0){
        return res.status(404).json({ message: "มีชื่อผู้ใช้นี้เเล้ว" });
    }
    
    if(password !== confPassword) return res.status(400).json({message: "Password not match"});
    //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
    const hashPassword = await argon2.hash(password); //function hash(password, options) option เช่น ขนาด รูปเบบ เเละการกินพื้นที่ ต่างๆ
    try {
        const response = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO customer (customer_id, phone_number, f_name, l_name, username, password) VALUES( ?, ?, ?, ?, ?, ?)",
                [id, phoneNumber, f_name, l_name, username, hashPassword],  (err, result) => {
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

//เป็นวิธีที่ช้ามากกกกกกก
export const updateCustomer = async (req, res) => {
    try {
        const id = req.params.id
        const authHeader = req.headers['authorization']
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const formData = req.body; 
        let customerPic = null;
        console.log(authToken.customerId, formData);
    
        if (req.file) {
            customerPic = req.file.filename; 
            console.log(customerPic);  
        }
        // Dynamic SQL - สร้าง Query เฉพาะฟิลด์ที่มีการเปลี่ยนแปลง
        let query = 'UPDATE customer SET ';
        const fields = [];
        const values = [];
    
        // Loop เพิ่มฟิลด์ที่มีการเปลี่ยนแปลง ทุกครั้งที่มีการอัปเดตจะมีข้อมูลรูปเสมอเพราะต้องส่งมาให้ multer หรือใช้ในการผ่านเงื่อนไข
        for (const [key, value] of Object.entries(formData)) {
          if (value) {
            fields.push(`${key} = ?`);
            values.push(value);
          }
        }
        
        // เพิ่มไฟล์ที่อัปโหลด (ถ้ามี)
        if (customerPic) {
          fields.push('customerpic = ?');
          values.push(customerPic);
        }

        query += fields.join(', ');
        query += ' WHERE customer_id = ?';
        values.push(id);

        // Debug Query
        console.log('Generated Query:', query);
        
        // เรียกใช้ Query กับฐานข้อมูล
        const results = await new Promise((resolve, reject) => {
            db.query(query, values, 
                (err, result, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        })
        res.status(200).json({ message: 'info updated successfully', results});
    } catch (error) {
        console.error("Error get customer by id:", error);
        return res.status(400).json({ message: "error updated info", error});
    }
}

export const deleteCustomer = async (req, res) => {
    
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
            db.query("INSERT INTO address (addressId, created_by, houseNo, province_id, amphure_id, tambon_id, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [id, authToken.customerId, houseNo, provincesId, amphuresId, tambonsId, postCode ],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const createConnectLineID = async (req, res) => {
    try {
        const id = uuidv4()
        const {profile, provider_name} = req.body
        console.log(profile, provider_name);
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO provider_login (provider_login_id, customer_id, provider_name, provider_id) VALUES (?, ?, ?, ?)",
                    [id, authToken.customerId, provider_name, profile.userId ],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error delete category_product:', error);

        if (error.sqlState === '23000') {
            // Foreign key constraint error
            return res.status(409).json({
                message: "Line Account นี้ถูกใช้เเล้ว",
                error: error.sqlMessage,
            });
        } else {
            return res.status(400).json({ message: "Error delete category_product", error });
        }
    }
}

export const checkConnectLineID = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT pl.provider_login_id, c.customer_id FROM customer c
                      LEFT JOIN provider_login pl ON pl.customer_id = c.customer_id
                      WHERE c.customer_id = ?`,
                    [authToken.customerId],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const changePassword = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const {newPassword, confirmNewPassword} = req.body;
    
        if(newPassword !== confirmNewPassword) return res.status(400).json({message: "Password not match"});

        const hashPassword = await argon2.hash(newPassword); 
        const results = await new Promise((resolve, reject)=> {
            db.query(`UPDATE customer SET password = ?
                      WHERE customer_id = ?`,[hashPassword ,authToken.customerId],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const getProfileCustomer = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT username, customerpic FROM customer 
                      WHERE customer_id = ?`,
                    [authToken.customerId],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}