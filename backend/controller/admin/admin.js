import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

//ส่งออก Function getAdmin ด้วย export
export const getAdmin = async (req, res) => {
    try {
        db.query(
            //สร้าง Query มาทำงาน 
            "SELECT f_name,l_name,userName,role_function FROM admin", 
            //results คือค่าที่เราจะได้จากการไป get มา
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400),send();
                }
                console.log(results)
                res.status(200).json(results);
            }
        )
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getAdminById = async (req, res) => {
    // console.log(req);
    // console.log(res);
    // try {
    //     const response = await Admin.findOne({
    //         attributes:['phone_number','f_name','l_name','username'],
            
    //         where: {
    //             phone_number: req.params.phone_number
    //         }
    //     });
    //     res.status(200).json(response);
    // } catch (error) {
    //     res.status(500).json({msg: error.message});
    // }

    try {
        const UserName = req.params.userName
        console.log(id);
        
        db.query(
            "SELECT userName FROM Admin WHERE userName = ?",
            [UserName], 
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400),send();
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
        "INSERT INTO admin (admin_id, userName, password, f_name, l_name, role_function) VALUES(?, ?, ?, ?, ?, ?)",
        [id, userName, hashPassword, f_name, l_name, 'Admin'],
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400),send();
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

