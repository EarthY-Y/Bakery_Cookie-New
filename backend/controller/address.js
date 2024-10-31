import db from "../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

export const getAllAddress = async(req, res) => {
    try {
        const response = await new Promise((resolve, reject) => {
            db.query("SELECT province_nameTH,amphure_nameTH, tambon_nameTH, zip_code FROM province" + 
                "INNER JOIN amphure ON amphure.province_id = province.province_id" + 
                "INNER JOIN tambon ON tambon.amphure_id = amphure.amphure_id", (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        })
    } catch (error) {
        
    }
}

export const getProvice = async(req, res) => {
    try {
        const response = await new Promise((resolve, reject) => {
            db.query("SELECT province_id ,province_nameTH FROM province",  (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        })
        if(!response){
            throw new Error(response.data.message)
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error get customer by id:", error);
        return res.status(400).json({ message: "Error get province", error: error.message });
    }
}

export const getAmphure = async(req, res) => {
    try {
        const provinceId = req.params.provinceId;
        console.log(provinceId);
        const response = await new Promise((resolve, reject) => {
            db.query("SELECT amphure_id,amphure_nameTH FROM amphure WHERE province_id = ?",[provinceId],  (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        })
        if(!response){
            throw new Error(response.data.message)
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error get customer by id:", error);
        return res.status(400).json({ message: "Error get amphure", error: error.message });
    }
}

export const getTambon = async(req, res) => {
    try {
        const amphureId = req.params.amphureId;
        console.log();
        
        const response = await new Promise((resolve, reject) => {
            db.query("SELECT tambon_id,tambon_nameTH, zip_code FROM tambon WHERE amphure_id = ? ",[amphureId],  (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        })
        if(!response){
            throw new Error(response.data.message)
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error get customer by id:", error);
        return res.status(400).json({ message: "Error get amphure", error: error.message });
    }
}