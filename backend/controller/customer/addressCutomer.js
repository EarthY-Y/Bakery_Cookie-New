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
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT a.addressId, a.houseNo, a.zip_code, p.province_nameTH, ap.amphure_nameTH, t.tambon_nameTH FROM address a"+
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
        return res.status(400).json({ message: "Error get all adress", error });
    }
}

export const getAddressByAddressId = async(req, res) => {
    try {
        const id = req.params.id
        const authHeader = req.headers['authorization']
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT a.addressId, a.province_id, a.amphure_id, a.tambon_id, a.houseNo, a.zip_code, p.province_nameTH, ap.amphure_nameTH, t.tambon_nameTH FROM address a"+
                " INNER JOIN province p ON p.province_id = a.province_id" +
                " INNER JOIN amphure ap ON ap.amphure_id = a.amphure_id" +
                " INNER JOIN tambon t ON t.tambon_id = a.tambon_id " +
                " WHERE a.addressId = ?;",[id],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        })
        console.log(results);
        return res.status(200).json(results)
    } catch (error) {
        return res.status(400).json({ message: "Error get address by id address", error });
    }
}

export const updateAddressByAddressId = async(req, res) => {
    try {
        const id = req.params.id
        const {tambonsId, amphuresId, provincesId, houseNo, postCode} = req.body
        console.log(tambonsId, amphuresId, provincesId, houseNo, postCode);
        
        const authHeader = req.headers['authorization']
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }

        let query = 'UPDATE address SET ';
        const fields = [];
        const values = [];
        
        if (provincesId) {
            fields.push('province_id = ?');
            values.push(provincesId);
        }
        if (amphuresId) {
            fields.push('amphure_id = ?');
            values.push(amphuresId);
        }
        if (tambonsId) {
            fields.push('tambon_id = ?');
            values.push(tambonsId);
        }
        if (houseNo) {
            fields.push('houseNo = ?');
            values.push(houseNo);
        }
        if (postCode) {
            fields.push('zip_code = ?');
            values.push(postCode);
        }

        query += fields.join(', ');
        query += ' WHERE addressId = ?';
        values.push(id);

        const results = await new Promise((resolve, reject) => {
            db.query(query, values, 
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        })
        console.log(results);
        return res.status(200).json(results)
    } catch (error) {
        return res.status(400).json({ message: "Error update address by id address", error });
    }
}

export const deleteAddressCustomer = async(req, res) => {
    try {
        const {addressId} = req.body
        const results = await new Promise((resolve, reject) => {
            db.query(`DELETE FROM address WHERE addressId = ?`,[addressId], 
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                })
        })
        console.log(results);
        return res.status(200).json(results)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error delete address", error });
    }
}