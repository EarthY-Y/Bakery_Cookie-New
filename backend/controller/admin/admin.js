import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

//ส่งออก Function getAdmin ด้วย export
export const getAdmin = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT f_name,l_name,userName FROM admin", (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        
        console.log(results)
        return res.status(200).json(results);

    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error: error.message });
    }
}

export const getAdminById = async (req, res) => {
    try {
        const UserName = req.params.userName
        console.log(id);
        
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT userName FROM Admin WHERE userName = ?", [UserName], (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
        
        console.log(results)
        return res.status(200).json(results);
            
    } catch (error) {
        console.error("Error get admin by id", error);
        res.status(400).json({ message: "Error get admin by id", error: error.message });
    }
}

export const createAdmin = async (req, res) => {
    try {
        //gen id ให้ไม่ซ้ำกัน
        const id = uuidv4();
        //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
        const {userName, passWord, f_name, l_name, confPassword} = req.body;
        const materialPictureName = req.file.filename;
        const materialPictureType = req.file.mimetype;
        console.log('req.bod = ',req.body);
        console.log('file name ',materialPictureName ,'and', materialPictureType);

        if (!req.file) {
            return res.status(400).send({ message: "Material picture is required." });
        }
        
        if(passWord !== confPassword) return res.status(400).json({message: "Password not match"});
        //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
        const hashPassword = await argon2.hash(passWord); //function hash(password, options) option เช่น ขนาด รูปเบบ เเละการกินพื้นที่ ต่างๆ
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO admin (admin_id, userName, password, f_name, l_name, adminpic, is_active) VALUES(?, ?, ?, ?, ?, ?, ?)",
                    [id, userName, hashPassword, f_name, l_name, materialPictureName , 'Y'], 
                    (err, result) =>{
                        if(err) return reject(err);
                        resolve({message: "Register complete", result});
                    }
            )
        })
                
        return res.status(201).json(results.message); 
            
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(400).json({ message: "Error creating admin", error: error.message });
    }
}

export const updateAdmin = (req, res) => {
    
}

export const deleteAdmin = (req, res) => {
    
}

export const roleAdmin = (req, res) => {
    
}

