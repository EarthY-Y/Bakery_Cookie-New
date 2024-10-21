import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";
import {uploadSingle} from '../../middleware/upload/pictureUpload.js'

export const getMaterial = async (req, res) => {
    try {
        await db.query(
            "SELECT material_name, quantity, cost, materialpic_name, materialpic_type, create_at, updated_at FROM material", 
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400).send()
                }
                console.log('ผลของการค้นหาคือ',results)
                return res.status(200).json(results);
            }
        )
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getMaterialById = async (req, res) => {

}

export const createMaterial = async (req, res) => {
    const authHeader = req.headers['authorization']
    
    const token = await passToken(authHeader)
    const id = uuidv4();
    const { material_name, quantity, cost } = req.body;
    console.log('file req',req.file);
    const materialPictureName = req.file.filename;
    const materialPictureType = req.file.mimetype;
    console.log('file name ',materialPictureName ,'and', materialPictureType);
    try {
        await db.query(
            "INSERT INTO material (material_id, material_name, quantity, cost, materialpic_name, materialpic_type, admin_id) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [id, material_name, quantity, cost, materialPictureName, materialPictureType, token.admin_id],
            (err, results, fields) => {
                console.log('its results ',results);
                
                if (err) {
                    console.log(err);
                    return res.status(400).send({ msg: "Error creating material" });
                }
                res.status(201).json({ msg: "Material created successfully" });
            }
        );
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateMaterial = async (req, res) => {
    
}

export const deleteMaterial = async (req, res) => {
    
}