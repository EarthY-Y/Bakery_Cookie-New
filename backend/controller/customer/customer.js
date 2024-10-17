import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";




//ส่งออก Function getCustomer ด้วย export
export const getCustomer = async (req, res) => {
    try {
        db.query(
            //สร้าง Query มาทำงาน 
            "SELECT * FROM customer", 
            //results คือค่าที่เราจะได้จากการไป get มา
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400).send()
                }
                console.log(results)
                res.status(200).json(results);
            }
        )
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getCustomerById = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        
        db.query(
            "SELECT * FROM customer WHERE id = ?",
            [id], 
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400).send()
                }
                console.log(results)
                res.status(200).json(results);
            }
        )
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createCustomer = async (req, res) => {
    //gen id ให้ไม่ซ้ำกัน
    const id = uuidv4();
    //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
    const {phone_number, username, password, confPassword, f_name, l_name} = req.body;
    
    if(password !== confPassword) return res.status(400).json({msg: "Password not match"});
    //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
    const hashPassword = await argon2.hash(password); //function hash(password, options) option เช่น ขนาด รูปเบบ เเละการกินพื้นที่ ต่างๆ
    try {
        db.query(
        "INSERT INTO customer (customerId, phone_number, f_name, l_name, username, password, role_function,) VALUES(?, ?, ?, ?, ?, ?, ? )",
        [id, f_name, l_name, username, hashPassword, "usere", id],
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400).send()
                }
        res.status(201).json({msg: "Register complete"}); 
    }
    )
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateCustomer = (req, res) => {
    
}

export const deleteCustomer = (req, res) => {
    
}

