import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";


export const getProduct = async (req, res) => {
    try {
        db.query(
            "SELECT * FROM product", 
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400).send()
                }
                console.log(results)
                res.status(200).json(results);
            }
        )
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductById = async (req, res) => {
    
}

export const createProduct = async (req, res) => {
    
}

export const updateProduct = async (req, res) => {
    
}

export const deleteProduct = async (req, res) => {
    
}