import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";


export const getProduct = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_id, p.selling_price_per_quantity, p.quantity_per_time, p.product_name, pp.productpic_name, SUM(m.cost_per_quantity * pm.amount) AS cost FROM product p"+
                    " LEFT JOIN productpicture pp ON p.product_id = pp.product_id" +
                    " LEFT JOIN product_material pm ON p.product_id = pm.product_id" + 
                    " LEFT JOIN material m ON pm.material_id = m.material_id" +
                    " GROUP BY p.product_id, p.product_name, pp.productpic_name" +
                    " ORDER BY p.product_id;",
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const getProductById = async (req, res) => {
    const id = req.params.id
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_id, p.product_name, p.quantity_per_time, p.selling_price_per_quantity, p.description, p.created_by, p.updated_by, p.created_at, p.updated_at, "+
                     "pp.productpic_name, pm.amount, m.material_id, m.material_name, m.cost_per_quantity, a.userName FROM product p "+
                     "INNER JOIN admin a ON a.admin_id = p.created_by "+ 
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
        res.status(400).json({ message: "Error get product", error});
    }
}

export const createProduct = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const id = uuidv4();
        
        const { product_name, quantity, price, description } = req.body;

        const productResult = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO product (product_id, product_name, quantity_per_time, selling_price_per_quantity, description, created_by) VALUES (?, ?, ?, ?, ?, ?)", // การใช้ ? คือ Parameterized Query
                [id, product_name, quantity, price, description, token.admin_id],
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
            return res.status(500).json({ message: 'Error creating product', error});
        }
    }
};

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
                "INSERT INTO productpicture (productpic_id, product_id, productpic_name, productpic_type, created_by) VALUES (?, ?, ?, ?, ?)",
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

        const ingredientValues = ingredients.map(item => [uuidv4(), id, item.material_id, item.quantity, tokenId]);

        const results = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO product_material (product_material_Id,product_id, material_id, amount, created_by) VALUES ?",
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

export const updateProduct = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const { id } = req.params;

        const { product_name, quantity_per_time, selling_price_per_quantity, description, ingredients, productpic_name, deletedIngredients, updatedIngredients } = req.body;

        // 1. อัปเดตข้อมูลในตาราง product
        let updateQuery = "UPDATE product SET  ";
        let updateValues = [];

        if (product_name) {
            updateQuery += "product_name = ?, ";
            updateValues.push(product_name);
        }

        if (quantity_per_time) {
            updateQuery += "quantity_per_time = ?, ";
            updateValues.push(quantity_per_time);
        }

        if (selling_price_per_quantity) {
            updateQuery += "selling_price_per_quantity = ?, ";
            updateValues.push(selling_price_per_quantity);
        }

        if (description) {
            updateQuery += "description = ?, ";
            updateValues.push(description);
        }

        updateQuery = updateQuery.slice(0, -2); // ลบคอมม่าออก
        updateQuery += " WHERE product_id = ?";
        updateValues.push(id);

        if (product_name || quantity_per_time || selling_price_per_quantity  || description || quantity_per_time ) {
            await new Promise((resolve, reject) => {
                db.query(updateQuery, updateValues, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }

        // 2. อัปเดตข้อมูลในตาราง productpicture (อัปโหลดไฟล์ใหม่หรือเปลี่ยนชื่อไฟล์)
        if (req.file) {
            await updateProductPicture(req, id, token.admin_id);
        }

        // 3. อัปเดตข้อมูลในตาราง product_material (อัปเดต ingredients)
        if (deletedIngredients || ingredients || updatedIngredients) {
            await updateProductMaterial(req, id, ingredients, deletedIngredients, updatedIngredients, token.admin_id);
        }

        return res.status(200).json({ message: "Product updated successfully" });

    } catch (error) {
        console.error("Error updating product:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error updating product', error });
        }
    }
};
const updateProductPicture = async (req, productId, tokenId) => {
    try {
        let updateQuery = "UPDATE productpicture SET ";
        let updateValues = [];

        if (req.file) {
            updateQuery += "productpic_name = ?, productpic_type = ?, updated_by = ? ";
            updateValues.push(req.file.filename, req.file.mimetype, tokenId);
        }

        updateQuery += "WHERE product_id = ? LIMIT 1";
        updateValues.push(productId);

        const pictureResult = await new Promise((resolve, reject) => {
            db.query(updateQuery, updateValues, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        return pictureResult;
    } catch (error) {
        console.error("Error updating product picture:", error);
        throw error;
    }
};
const updateProductMaterial = async (req, productId, ingredients, deletedIngredients, updatedIngredients, tokenId) => {
    try {
        console.log("im here updateProductMaterial",ingredients,deletedIngredients);

        if (typeof deletedIngredients === 'string') {
            deletedIngredients = JSON.parse(deletedIngredients);  // แปลงสตริงเป็นอาร์เรย์
        }
        
        console.log("deletedIngredients after parsing:", deletedIngredients);
        // ตรวจสอบว่ามีการส่ง deletedIngredients มาและเป็นอาร์เรย์
        if (deletedIngredients && Array.isArray(deletedIngredients) && deletedIngredients.length > 0) {
            console.log("Deleting materials:", deletedIngredients);
            const deletedMaterialIds = deletedIngredients.map(item => item.material_id); 
        
            if (deletedMaterialIds.length > 0) {
                await new Promise((resolve, reject) => {
                    db.query(
                        "DELETE FROM product_material WHERE product_id = ? AND material_id IN (?)",
                        [productId, deletedMaterialIds],
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
            }
        } else {
            console.log("No deleted ingredients or invalid format.");
        }

        // 2. ตรวจสอบว่า ingredients ถูกส่งมาหรือไม่
        if (ingredients) {
            console.log("ingredients", ingredients);
            
            // ตรวจสอบและแปลงเป็นอาร์เรย์หากเป็นสตริง
            if (typeof ingredients === 'string') {
                ingredients = JSON.parse(ingredients);
            }

            if (!Array.isArray(ingredients)) {
                throw new Error("Ingredients is not an array");
            }

            // 3. อัปเดตข้อมูลใน product_material
            const ingredientValues = ingredients.filter(item => item.quantity !== null).map(item => [uuidv4(), productId, item.material_id, item.quantity, tokenId]);

            // อัปเดตหรือเพิ่มข้อมูลที่ไม่ได้ถูกลบ
            if (ingredientValues.length > 0) {
                await new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO product_material (product_material_Id, product_id, material_id, amount, updated_by) VALUES ? ON DUPLICATE KEY UPDATE amount = VALUES(amount), updated_by = VALUES(updated_by)",
                        [ingredientValues],
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
            }
        }

        // 2. ตรวจสอบว่า updatedIngredients ถูกส่งมาหรือไม่
        if (updatedIngredients) {
            // ตรวจสอบและแปลงเป็นอาร์เรย์หากเป็นสตริง
            // console.log("updatedIngredients", updatedIngredients);
            
            if (typeof updatedIngredients === 'string') {
                updatedIngredients = JSON.parse(updatedIngredients);
            }

            if (!Array.isArray(updatedIngredients)) {
                throw new Error("Ingredients is not an array");
            }

            // 3. อัปเดตข้อมูลใน product_material
            if (Array.isArray(updatedIngredients) && updatedIngredients.length > 0) {
                for (const item of updatedIngredients) {
                    if (item.quantity !== null) {
                        await new Promise((resolve, reject) => {
                            db.query(
                                "UPDATE product_material SET amount = ?, updated_by = ? WHERE product_id = ? AND material_id = ?",
                                [item.quantity, tokenId, productId, item.material_id],
                                (err, result) => {
                                    if (err) return reject(err);
                                    resolve(result);
                                }
                            );
                        });
                    }
                }
            }
        }

        return { message: "Product materials updated successfully" };
    } catch (error) {
        console.error("Error updating product materials:", error);
        throw error;
    }
};


export const deleteProduct = async (req, res) => {
    const id = req.params.id
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