import db from "../config/dataBase.js"
import argon2 from "argon2";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();

export const LoginCutomer = async (req, res) =>{
    console.log("req.body = ",req.body);
    const {userName,passWord} = req.body
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT customer_id, username, password, is_active FROM customer WHERE username = ?", userName, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    
        console.log('res from customer ', results);
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = results[0];
        const match = await argon2.verify(user.password, passWord);
        if (!match) {
            return res.status(400).json({ message: "Wrong Password" });
        }
        if (user.is_active == 0) {
            return res.status(400).json({ message: "It's account not active" });
        }
        const token = jwt.sign({ customerId: user.customer_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: "login complete", token: token, role: "user" });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Database error" });
    }
}

export const LINELoginCutomer = async (req, res) =>{
    console.log("req.body = ",req.body);
    const {profile} = req.body
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(`SELECT c.customer_id, c.username, c.password, c.is_active FROM customer c
                    LEFT JOIN provider_login pl ON pl.customer_id = c.customer_id
                    WHERE provider_id = ?`, [profile.userId]
            , (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    
        console.log('res from customer ', results);
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = results[0];
        if (!user.customer_id) {
            return res.status(400).json({ message: "Dont found connect Line ID with some account" });
        }
        if (user.is_active == 0) {
            return res.status(400).json({ message: "It's account not active" });
        }
        const token = jwt.sign({ customerId: user.customer_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: "login complete", token: token, role: "user" });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Database error" });
    }
}
export const LoginAdmin = async (req, res) =>{
    console.log("req.body = ",req.body);
    const {userName,passWord} = req.body
    try {
        const resultsAdmin = await new Promise((resolve, reject) => {
            db.query("SELECT admin_id, userName, passWord, is_active FROM admin WHERE userName = ?", userName, (err, resultsAdmin) => {
                if (err) return reject(err);
                resolve(resultsAdmin);
            });
        });

        console.log('res from admin ', resultsAdmin);
        if (resultsAdmin.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = resultsAdmin[0];
        console.log(user);
        const match = await argon2.verify(user.passWord, passWord);
        if (!match) {
            return res.status(400).json({ message: "Wrong Password" });
        }
        const tokenAdmin = jwt.sign({ admin_id: user.admin_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: "login complete", tokenAdmin: tokenAdmin, role: "admin" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Database error" });
    }
}

//สร้างขึ้นเพื่อเวลาสร้าง seesion ตอน login เพื่อเอาไปใช้ในการตรวจสอบการ login ในหน้าต่างๆ 
// export const Login = async (req, res) =>{
//     console.log("req.body = ",req.body);
//     const {userName,passWord} = req.body
//     try {
//         const results = await new Promise((resolve, reject) => {
//             db.query("SELECT customer_id, username, password FROM customer WHERE username = ?", userName, (err, results) => {
//                 if (err) return reject(err);
//                 resolve(results);
//             });
//         });
    
//         console.log('res from customer ', results);
//         if (results.length === 0) {
//             const resultsAdmin = await new Promise((resolve, reject) => {
//                 db.query("SELECT admin_id, userName, passWord, is_active FROM admin WHERE userName = ?", userName, (err, resultsAdmin) => {
//                     if (err) return reject(err);
//                     resolve(resultsAdmin);
//                 });
//             });
    
//             console.log('res from admin ', resultsAdmin);
//             if (resultsAdmin.length === 0) {
//                 return res.status(404).json({ message: "User not found" });
//             }
//             const user = resultsAdmin[0];
//             console.log(user);
//             const match = await argon2.verify(user.passWord, passWord);
//             if (!match) {
//                 return res.status(400).json({ message: "Wrong Password" });
//             }
//             const token = jwt.sign({ admin_id: user.admin_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//             return res.status(200).json({ message: "login complete", token: token, role: "admin" });
//         } else { 
//             const user = results[0];
//             const match = await argon2.verify(user.password, passWord);
//             if (!match) {
//                 return res.status(400).json({ message: "Wrong Password" });
//             }
//             const token = jwt.sign({ customerId: user.customer_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//             return res.status(200).json({ message: "login complete", token: token, role: "user" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Database error" });
//     }
// }

export const logOutCustomer = (req, res) =>{
    
}