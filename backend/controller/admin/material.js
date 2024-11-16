import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

export const getMaterial = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT material_id, material_name, quantity, cost, cost_per_quantity, materialpic_name, materialpic_type, create_at, update_at FROM material", 
                (err, result) => {
                    if(err) return reject(err)
                    resolve(result)
                }
            )
        })
        console.log('results material ', results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get material", error);
        return res.status(400).json({ message: "Error get material", error });
    }
}

export const getMaterialById = async (req, res) => {
    const id = req.params.id

    try {
        const result = await new Promise((resolve, reject) => {
            db.query("SELECT m.material_id, m.material_name, m.quantity, m.cost, m.cost_per_quantity, m.materialpic_name, m.create_by, m.create_at, a.userName FROM material m INNER JOIN admin a ON a.admin_id = m.create_by WHERE material_id = ?", [id], 
                (err, result) => {
                    if(err) return reject(err)
                    resolve(result)
                })
        })
        return res.status(200).json(result)
    } catch (error) {
        
    }
}

export const createMaterial = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
    
        const token = await passToken(authHeader)
        const id = uuidv4();
        const { material_name, quantity, cost, costesperquantities } = req.body;
        console.log('file req',req.file);
        const materialPictureName = req.file.filename;
        const materialPictureType = req.file.mimetype;
        console.log('file name ',materialPictureName ,'and', materialPictureType);
    
        if (!req.file) {
            return res.status(400).send({ message: "Material picture is required." });
        }
        const results = await new Promise((resolve, reject) => {
            db.query("INSERT INTO material (material_id, material_name, quantity, cost, materialpic_name, cost_per_quantity, materialpic_type, status, create_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [id, material_name, quantity, cost, materialPictureName, costesperquantities, materialPictureType, 'active', token.admin_id],
                (err, result, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
        return res.status(200).json({ message: "Material created successfully", results });
    } catch (error) {
        console.error("Error creating material:", error);
        return res.status(400).json({ message: "Error creating material", error });
    }
}

export const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params; // รับ material_id จาก URL
        const updates = req.body; // รับข้อมูลฟิลด์ที่ต้องการอัปเดต
        let materialpic_name = null;
        console.log(updates);

        if (req.file) {
            materialpic_name = req.file.filename; // เก็บ URL ของไฟล์ที่อัปโหลด
        }
      
        // Dynamic SQL - สร้าง Query เฉพาะฟิลด์ที่มีการเปลี่ยนแปลง
        let query = 'UPDATE material SET ';
        const fields = [];
        const values = [];
    
        // Loop เพิ่มฟิลด์ที่มีการเปลี่ยนแปลง
        for (const [key, value] of Object.entries(updates)) {
          if (value) {
            fields.push(`${key} = ?`);
            values.push(value);
          }
        }
      
        // เพิ่มไฟล์ที่อัปโหลด (ถ้ามี)
        if (materialpic_name) {
          fields.push('materialpic_name = ?');
          values.push(materialpic_name);
        }
      
        // เพิ่ม updated_at
        const authHeader = req.headers['authorization']
        const token = await passToken(authHeader)
        if(token) {
            fields.push('update_by = ?');
            values.push(token.admin_id);
        }else{
            throw new Error("ไม่มี token")
        }
        query += fields.join(', ');
        query += ' WHERE material_id = ?';
        values.push(id);

        console.log(updates);

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
      
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Material not found' });
        }
      
        res.status(200).json({ message: 'Material updated successfully' });
    } catch (error) {
        console.error("Error get customer by id:", error);
        return res.status(400).json({ message: "Error get province", error});
    }
  };
  

export const deleteMaterial = async (req, res) => {
    const id = req.params.id
    console.log("delete by id ",id);
    
    try {
        const result = await new Promise((resolve, reject) => {
            db.query("DELETE FROM material WHERE material_id = ?", [id], 
                (err, result) => {
                    if(err) return reject(err)
                    resolve(result)
                })
        })
        return res.status(200).json(result)
    } catch (error) {
        
    }
}