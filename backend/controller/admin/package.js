import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";
import {handleDelete} from '../../middleware/deleteUpload/image/deleteUpload.js'

export const getpackage = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM package p",
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get package:", error);
        res.status(400).json({ message: "Error get package", error});
    }
}

export const getpackageById = async (req, res) => {
    const id = req.params.id
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT p.*, a.userName as created_by, a_updated.userName as updated_by FROM package p
                      LEFT JOIN admin a ON a.admin_id = p.created_by
                      LEFT JOIN admin a_updated ON a_updated.admin_id = p.updated_by
                      WHERE p.package_id = ?`,[id], 
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log(results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get package:", error);
        res.status(400).json({ message: "Error get package", error});
    }
}

export const createpackage = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const id = uuidv4();
        
        const { package_name, cost, quantity, costPreQuantity } = req.body;
        const packagePictureName = req.file.key;

        const packageResult = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO package (package_id, package_name, package_pic, cost, quantity, cost_per_quantity, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", // การใช้ ? คือ Parameterized Query
                [id, package_name, packagePictureName, cost, quantity, costPreQuantity, token.admin_id],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });

        return res.status(200).json({ message: "package created successfully", packageResult });

    } catch (error) {
        console.error("Error creating package:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error creating package', error});
        }
    }
};

export const updatepackage = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const { id } = req.params;

        const {active, package_name, quantity, cost, cost_per_quantity} = req.body;

        // ดึงชื่อไฟล์รูปภาพเก่าจากฐานข้อมูล
        const oldPictureQuery = "SELECT package_pic FROM package WHERE package_id = ? LIMIT 1";
        const oldPicture = await new Promise((resolve, reject) => {
            db.query(oldPictureQuery, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]?.package_pic); // ได้ชื่อไฟล์รูปภาพเก่า
            });
        });

        // ลบรูปภาพเก่าถ้ามีการอัปโหลดไฟล์ใหม่
        if (req.file && oldPicture) {
            await handleDelete(oldPicture)
        }

        // 1. อัปเดตข้อมูลในตาราง package
        let updateQuery = "UPDATE package SET  ";
        let updateValues = [];

        if (package_name) {
            updateQuery += "package_name = ?, ";
            updateValues.push(package_name);
        }

        if (active) {
            let change_status = active.replace(/[^0-9.]/g, '').trim()
            let is_active = false
            if (change_status == "1") {
                is_active = true
                updateQuery += "is_active = ?, ";
                updateValues.push(is_active);
            } 
            updateQuery += "is_active = ?, ";
            updateValues.push(is_active);
        }

        if (quantity) {
            updateQuery += "quantity = ?, ";
            updateValues.push(quantity);
        }

        if (cost) {
            updateQuery += "cost = ?, ";
            updateValues.push(cost);
        }

        if (cost_per_quantity) {
            updateQuery += "cost_per_quantity = ?, ";
            updateValues.push(cost_per_quantity);
        }

        if (req.file) {
            updateQuery += "package_pic = ?, ";
            updateValues.push(req.file.key);
        }

        if (token.admin_id) {
            updateQuery += "updated_by = ?, ";
            updateValues.push(token.admin_id);
        }

        updateQuery = updateQuery.slice(0, -2); // ลบคอมม่าออก
        updateQuery += " WHERE package_id = ?";
        updateValues.push(id);

        if (package_name || quantity || cost  || cost_per_quantity || req.file || active ) {
            await new Promise((resolve, reject) => {
                db.query(updateQuery, updateValues, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }

        return res.status(200).json({ message: "package updated successfully" });

    } catch (error) {
        console.error("Error updating package:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error updating package', error });
        }
    }
};

export const deletepackage = async (req, res) => {
    const id = req.params.id
    try {
        const response = await new Promise((resolve, reject) => {
            db.query('DELETE FROM package WHERE package_id = ?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        console.log('package deleted successfully.');
        return res.status(200).json(response)
    } catch (error) {
        console.error("Error delete package:", error);
        res.status(400).json({ message: "Error delete package", error});
    }
}