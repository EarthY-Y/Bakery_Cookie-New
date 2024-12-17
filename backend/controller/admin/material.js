import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";
import fs from 'fs';
import path from 'path';

export const getMaterial = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT material_id, material_name, quantity, cost, cost_per_quantity, materialpic_name, created_at, updated_at FROM material", 
                (err, result) => {
                    if(err) return reject(err)
                    resolve(result)
                }
            )
        })
        // console.log('results material ', results)
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
            db.query("SELECT m.material_id, m.material_name, m.quantity, m.cost, m.cost_per_quantity, m.materialpic_name, m.created_by, m.created_at, a.userName FROM material m INNER JOIN admin a ON a.admin_id = m.created_by WHERE material_id = ?", [id], 
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
            db.query("INSERT INTO material (material_id, material_name, quantity, cost, materialpic_name, cost_per_quantity, created_by) VALUES( ?, ?, ?, ?, ?, ?, ?, ?)",
                [id, material_name, quantity, cost, materialPictureName, costesperquantities, materialPictureType, token.admin_id],
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

        // ดึงชื่อไฟล์รูปภาพเก่าจากฐานข้อมูล
        const oldPictureQuery = "SELECT materialpic_name FROM material WHERE material_id = ? LIMIT 1";
        const oldPicture = await new Promise((resolve, reject) => {
            db.query(oldPictureQuery, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]?.materialpic_name); // ได้ชื่อไฟล์รูปภาพเก่า
            });
        });

        // ลบรูปภาพเก่าถ้ามีการอัปโหลดไฟล์ใหม่
        if (req.file && oldPicture) {
            const oldPicturePath = path.join('picture', oldPicture); // พาธของไฟล์เก่า
            if (fs.existsSync(oldPicturePath)) { // ตรวจสอบว่าไฟล์มีอยู่จริง
                fs.unlinkSync(oldPicturePath); // ลบไฟล์
            }
        }
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
            fields.push('updated_by = ?');
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