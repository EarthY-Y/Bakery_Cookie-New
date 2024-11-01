import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";


export const getProduct = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM product p"+ 
                    " INNER JOIN productpicture pp ON pp.product_id = p.product_id;", 
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
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
    try {
        const authHeader = req.headers['authorization']
        const token = await passToken(authHeader)
        const id = uuidv4(); //จะเจนทุกครั้งที่เรียกใช้ uuidv4
        const { product_name, quantity, cost, price, description } = req.body;
        
        const results = await new Promise((resolve, reject) => {
            db.query("INSERT INTO product (product_id, product_name, quantity, cost, price, description, create_by) VALUES(?, ?, ?, ?, ?, ?, ?)",
                [id, product_name, quantity, cost, price, description, token.admin_id],
                (err, result, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
        if(results){
            await createProductPicture(req, res, id)
            return res.status(200).json({ message: "Material created successfully", results });
        }
    } catch (error) {
        console.error("Error creating material:", error);
        return res.status(400).json({ message: "Error creating product", error });
    }
}

const createProductPicture = async (req, res, id) => {
    try {
        const idPicture = uuidv4()
        console.log('file req',req.file);
        const productPictureName = req.file.filename;
        const materialPictureType = req.file.mimetype;
        console.log('file name ',productPictureName ,'and', materialPictureType);
        if (!req.file) {
            return res.status(400).send({ message: "Material picture is required." });
        }
        const results = await new Promise((resolve, reject) => {
            db.query("INSERT INTO productpicture (productpic_id, product_id , productpic_name, productpic_type) VALUES(?, ?, ?, ?)",
                [idPicture, id, productPictureName, materialPictureType],
                (err, result, fields) => {
                    if (err) {
                        return reject(err); //ส่ง error ไปยัง block catch ทันที
                    }
                    resolve(result);
                }
            );
        });
        return results
    } catch (error) {
        console.error("Error creating material:", error);
        return res.json({ message: "Error creating product picture", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    
}

export const deleteProduct = async (req, res) => {
    
}