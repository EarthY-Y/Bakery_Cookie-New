import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

export const getMaterial = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM material", 
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
        return res.status(400).json({ message: "Error get material", error: error.message });
    }
}

export const getMaterialById = async (req, res) => {

}

export const createMaterial = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
    
        const token = await passToken(authHeader)
        const id = uuidv4();
        const { material_name, quantity, cost } = req.body;
        console.log('file req',req.file);
        const materialPictureName = req.file.filename;
        const materialPictureType = req.file.mimetype;
        console.log('file name ',materialPictureName ,'and', materialPictureType);
    
        if (!req.file) {
            return res.status(400).send({ message: "Material picture is required." });
        }
        const results = await new Promise((resolve, reject) => {
            db.query("INSERT INTO material (material_id, material_name, quantity, cost, materialpic_name, materialpic_type, admin_id) VALUES(?, ?, ?, ?, ?, ?, ?)",
                [id, material_name, quantity, cost, materialPictureName, materialPictureType, token.admin_id],
                (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                }
            );
        });
        return res.status(200).json({ message: "Material created successfully", results });
    } catch (error) {
        console.error("Error creating material:", error);
        return res.status(400).json({ message: "Error creating material", error: error.message });
    }
}

export const updateMaterial = async (req, res) => {
    
}

export const deleteMaterial = async (req, res) => {
    
}