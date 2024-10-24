import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";


export const getProduct = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM products", (err, results) => { 
                if (err) return reject(err)
                resolve(results)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error: error.message });
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