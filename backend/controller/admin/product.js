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
    const id = req.params.id
    console.log("get by id ",id);
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_id, p.product_name, p.quantity, p.cost, p.price, p.description, p.create_by, p.update_by, p.create_at, p.updated_at, "+
                     "pp.productpic_name, pm.amount, m.material_name, a.userName FROM product p "+
                     "INNER JOIN admin a ON a.admin_id = p.create_by "+ 
                     "INNER JOIN productpicture pp ON pp.product_id = p.product_id "+
                     "INNER JOIN product_material pm ON pm.product_id = p.product_id "+
                     "INNER JOIN material m ON m.material_id = pm.material_id WHERE p.product_id = ?",
                     [id], 
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

export const createProduct = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const id = uuidv4();
        
        const { product_name, quantity, cost, price, description } = req.body;

        const productResult = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO product (product_id, product_name, quantity, cost, price, description, create_by) VALUES (?, ?, ?, ?, ?, ?, ?)", // การใช้ ? คือ Parameterized Query
                [id, product_name, quantity, cost, price, description, token.admin_id],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });

        if (productResult) {
            await createProductPicture(req, id, token.admin_id);
            await createProductMaterial(req, id, token.admin_id);

            return res.status(200).json({ message: "Product created successfully", productResult });
        }
    } catch (error) {
        console.error("Error creating product:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error creating product', error: error.message });
        }
    }
};



export const updateProduct = async (req, res) => {
    
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id
    console.log("get by id ",id);
    try {
        // เริ่มต้น transaction
        await new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) return reject(err);
                resolve();
            });
        });

        // ลบจาก productpicture
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM productpicture WHERE product_id = ?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // ลบจาก product_material
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM product_material WHERE product_id = ?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // ลบจาก product
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM product WHERE product_id = ?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // Commit transaction
        const response = await new Promise((resolve, reject) => {
            db.commit(err => {
                if (err) return reject(err);
                resolve();
            });
        });

        console.log('Product deleted successfully.');
        return res.status(200).json(response)
    } catch (error) {
        // Rollback transaction ในกรณีที่มีข้อผิดพลาด
        await new Promise((resolve, reject) => {
            db.rollback(() => {
                console.error('Rollback transaction due to error:', error);
                resolve();
            });
        });
        throw new Error('Failed to delete product: ' + error.message);
    }
}

const createProductPicture = async (req, id, tokenId) => {
    try {
        const idPicture = uuidv4();
        const productPictureName = req.file.filename;
        const materialPictureType = req.file.mimetype;

        if (!req.file) {
            throw new Error("Material picture is required.");
        }

        const results = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO productpicture (productpic_id, product_id, productpic_name, productpic_type, create_by) VALUES (?, ?, ?, ?, ?)",
                [idPicture, id, productPictureName, materialPictureType, tokenId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });

        return results;
    } catch (error) {
        console.error("Error creating product picture:", error);
        throw error; 
        /* 
        ให้โยน error แทนการส่ง response เพราะ function 
        นี้ถูกเรียกเอาไปใช้ใน function อื่น ถ้ามี retrun res.status เยอะจะให้เกิด error ได้ HTTP.HEADER ได้
        */
    }
};

const createProductMaterial = async (req, id, tokenId) => {
    try {
        let ingredients = req.body.ingredients;

        // ตรวจสอบและแปลงเป็นอาร์เรย์หากเป็นสตริง
        if (typeof ingredients === 'string') {
            ingredients = JSON.parse(ingredients);
        }

        if (!Array.isArray(ingredients)) {
            throw new Error("Ingredients is not an array");
        }

        const ingredientValues = ingredients.map(item => [id, item.material_id, item.quantity, tokenId]);

        const results = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO product_material (product_id, material_id, amount, create_by) VALUES ?",
                [ingredientValues],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });

        return results;
    } catch (error) {
        console.error("Error creating product materials:", error);
        throw error;
    }
};