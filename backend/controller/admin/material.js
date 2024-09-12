import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

export const getMaterial = async (req, res) => {
    try {
        db.query(
            "SELECT * FROM material", 
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

export const getMaterialById = async (req, res) => {

}

export const createMaterial = async (req, res) => {
    const id = uuidv4();
    const { material_name, quantity, cost , admin_id} = req.body;
    console.log(material_name);
    
    try {
        db.query(
            "INSERT INTO material (material_id, material_name, quantity, cost, admin_id) VALUES(?, ?, ?, ?, ?)",
            [id, material_name, quantity, cost, admin_id],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ msg: "Error creating material" });
                }
                res.status(201).json({ msg: "Material created successfully" },{results});
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