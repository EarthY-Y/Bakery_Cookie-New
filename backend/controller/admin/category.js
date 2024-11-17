import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";

export const getListCategory = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM category",
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get category:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const craeteCategory = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = await passToken(authHeader)
        const { categoryName } = req.body;
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO category (category_id, category_name, created_by) VALUES{?, ?, ?}", [uuidv4(), categoryName, token.admin_id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get category:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const getProductPicture = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.* , pp.productpic_name FROM product p" + 
                    " INNER JOIN productpicture pp ON pp.product_id = p.product_id",
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get category:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}