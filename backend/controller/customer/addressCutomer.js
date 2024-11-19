import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";
import argon2 from "argon2";

export const getAllAddressCustomer = async(req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        console.log(authToken);
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT a.addressId, a.houesNo, a.zip_code, p.province_nameTH, ap.amphure_nameTH, t.tambon_nameTH FROM address a"+
                    " INNER JOIN province p ON p.province_id = a.province_id" +
                    " INNER JOIN amphure ap ON ap.amphure_id = a.amphure_id" +
                    " INNER JOIN tambon t ON t.tambon_id = a.tambon_id " +
                    " WHERE created_by = ?;",[authToken.customerId], 
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        })
        console.log(results);
        return res.status(200).json(results)
    } catch (error) {
        
    }
}