import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

//ส่งออก Function getAdmin ด้วย export
export const getAdmin = async (req, res) => {
    try {
        db.query(
            //สร้าง Query มาทำงาน 
            "SELECT f_name,l_name,userName FROM admin", 
            //results คือค่าที่เราจะได้จากการไป get มา
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400).send()
                }
                console.log(results)
                return res.status(200).json(results);
            }
        )
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getAdminById = async (req, res) => {
    try {
        const UserName = req.params.userName
        console.log(id);
        
        db.query(
            "SELECT userName FROM Admin WHERE userName = ?",
            [UserName], 
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

export const createAdmin = async (req, res) => {
    //gen id ให้ไม่ซ้ำกัน
    const id = uuidv4();
    //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
    const {userName, passWord, f_name, l_name, confPassword} = req.body;
    console.log(req.body);
    
    
    if(passWord !== confPassword) return res.status(400).json({msg: "Password not match"});
    //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
    const hashPassword = await argon2.hash(passWord); //function hash(password, options) option เช่น ขนาด รูปเบบ เเละการกินพื้นที่ ต่างๆ
    try {
        db.query(
        "INSERT INTO admin (admin_id, userName, password, f_name, l_name, is_active) VALUES(?, ?, ?, ?, ?, ?)",
        [id, userName, hashPassword, f_name, l_name, 'Y'],
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

export const updateAdmin = (req, res) => {
    
}

export const deleteAdmin = (req, res) => {
    
}

export const roleAdmin = (req, res) => {
    const id = uuidv4();
    try {
        db.query(
        "INSERT INTO admin (roleAdmin_id, roleName, create_by, update_by) VALUES(?, ?, ?, ?, ?, ?)",
        [id],
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

