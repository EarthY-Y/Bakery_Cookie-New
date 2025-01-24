import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";

export const getProduct = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT p.product_id, p.selling_price_per_quantity, p.quantity_per_time, p.product_name, pp.productpic_name, 
                      SUM(m.cost_per_quantity * pm.quantity) AS cost, p.is_active FROM product p
                      LEFT JOIN productpicture pp ON p.product_id = pp.product_id
                      LEFT JOIN product_material pm ON p.product_id = pm.product_id
                      LEFT JOIN material m ON pm.material_id = m.material_id
                      GROUP BY p.product_id, p.product_name, pp.productpic_name
                      ORDER BY p.product_id;`,
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const getProductById = async (req, res) => {
    const id = req.params.id
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT p.product_id, p.product_name, p.quantity_per_time, p.selling_price_per_quantity, p.weight_per_piece, 
                     p.description, p.created_at, p.updated_at, p.is_active, a_updated.userName as updated_by,
                     pp.productpic_name, pm.quantity, m.material_id, m.material_name, m.cost_per_quantity, a.userName as created_by FROM product p 
                     LEFT JOIN admin a ON a.admin_id = p.created_by 
                     LEFT JOIN admin a_updated ON a_updated.admin_id = p.updated_by
                     LEFT JOIN productpicture pp ON pp.product_id = p.product_id 
                     LEFT JOIN product_material pm ON pm.product_id = p.product_id 
                     LEFT JOIN material m ON m.material_id = pm.material_id WHERE p.product_id = ?`,
                     [id], 
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const getProductPackageById = async (req, res) => {
    const id = req.params.id
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT pp.package_product_id, pp.package_id, pck.package_name FROM product p"+ 
                    " LEFT JOIN package_product pp ON pp.product_id = p.product_id"+
                    " LEFT JOIN package pck ON pck.package_id = pp.package_id"+
                    " WHERE p.product_id = ?",
                     [id], 
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log("getProductPackageById", results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const getPackages = async (req, res) => {
    console.log("getPackage");
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT package_id, package_name, cost_per_quantity FROM package WHERE is_active = ?", ["1"],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log(results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const createProduct = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const id = uuidv4();
        
        const { product_name, quantityPerTime, price, description, packaging, ingredients, weightPerPiece } = req.body;

        const productResult = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO product (product_id, product_name, quantity_per_time, selling_price_per_quantity, weight_per_piece, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", // การใช้ ? คือ Parameterized Query
                [id, product_name, quantityPerTime, price, weightPerPiece, description, token.admin_id],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });

        if (productResult) {
            await createProductPicture(req, id, token.admin_id);
            if (ingredients) {
                await createProductMaterial(req, id, token.admin_id);
            }
            if (packaging) {
                await createProductPackage(req, id, token.admin_id);
            }
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
                "INSERT INTO productpicture (productpic_id, product_id, productpic_name, created_by) VALUES (?, ?, ?, ?)",
                [idPicture, id, productPictureName, tokenId],
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
                "INSERT INTO product_material (product_material_Id,product_id, material_id, quantity, created_by) VALUES ?",
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

const createProductPackage = async (req, id, tokenId) => {
    try {
        let packaging = req.body.packaging;

        // ตรวจสอบและแปลงเป็นอาร์เรย์หากเป็นสตริง
        if (typeof packaging === 'string') {
            packaging = JSON.parse(packaging);
        }

        if (!Array.isArray(packaging)) {
            throw new Error("Ingredients is not an array");
        }

        const ingredientValues = packaging.map(item => [uuidv4(), id, item.package_id, tokenId]);

        const results = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO package_product (package_product_Id, product_id, package_id, created_by) VALUES ?",
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

        const { product_name, quantity_per_time, selling_price_per_quantity, description, ingredients, productpic_name,
                is_active, deletedIngredients, deletedPackage, packages, weight_per_piece, updatedIngredients } = req.body;
        
        // 1. อัปเดตข้อมูลในตาราง product
  
        let updateQuery = "UPDATE product SET  ";
        let updateValues = [];
        
        if(is_active){
            let change_status = is_active.replace(/[^0-9.]/g, '').trim()// ลบทุกอย่างที่ไม่ใช่ตัวเลขหรือจุด เพราข้อมูลที่วส่งมาคือ "1" ถ้าจะเอาไปเทียบต้องใช้ ""1""
            if (change_status == "1") {
                let active = true
                updateQuery += "is_active = ?, ";
                updateValues.push(active);
            }else{
                let active = false
                updateQuery += "is_active = ?, ";
                updateValues.push(active);
            }
        }
        
        if (product_name) {
            updateQuery += "product_name = ?, ";
            updateValues.push(product_name);
        }

        if (quantity_per_time) {
            const cleanedValue = quantity_per_time.replace(/[^0-9.]/g, '').trim(); // ลบทุกอย่างที่ไม่ใช่ตัวเลขหรือจุด
            const numericValue = parseFloat(cleanedValue);
        
            if (!isNaN(numericValue)) {
                updateQuery += "quantity_per_time = ?, ";
                updateValues.push(numericValue);
            } else {
                console.error("Invalid numeric value for quantity_per_time:", quantity_per_time);
            }
        }

        if (selling_price_per_quantity) {
            const cleanedValue = selling_price_per_quantity.replace(/[^0-9.]/g, '').trim(); // ลบทุกอย่างที่ไม่ใช่ตัวเลขหรือจุด
            const numericValue = parseFloat(cleanedValue);
        
            if (!isNaN(numericValue)) {
                updateQuery += "selling_price_per_quantity = ?, ";
                updateValues.push(numericValue);
            } else {
                console.error("Invalid numeric value for selling_price_per_quantity:", selling_price_per_quantity);
            }
        }

        if (weight_per_piece) {
            console.log("Raw value:", weight_per_piece);
        
            // ลบอักขระพิเศษและแปลงเป็นตัวเลข เกิดข้อผิดพลาดทำให้มีอักขระพิเศษติดมาประมาณนี้ '\\"40\\"' เลยต้องเอาออก
            const cleanedValue = weight_per_piece.replace(/[^0-9.]/g, '').trim(); // ลบทุกอย่างที่ไม่ใช่ตัวเลขหรือจุด
            const numericValue = parseFloat(cleanedValue);
        
            if (!isNaN(numericValue)) {
                updateQuery += "weight_per_piece = ?, ";
                updateValues.push(numericValue);
            } else {
                console.error("Invalid numeric value for weight_per_piece:", weight_per_piece);
            }
        }

        if (description) {
            updateQuery += "description = ?, ";
            updateValues.push(description);
        }

        if (token.admin_id) {
            updateQuery += "updated_by = ?, ";
            updateValues.push(token.admin_id);
        }

        updateQuery = updateQuery.slice(0, -2); // ลบคอมม่าออก
        updateQuery += " WHERE product_id = ?";
        updateValues.push(id);
        console.log("Final SQL:", updateQuery, updateValues);

        if (product_name || quantity_per_time || selling_price_per_quantity  || weight_per_piece || description || quantity_per_time || is_active || token.admin_id ) {
            await new Promise((resolve, reject) => {
                db.query(updateQuery, updateValues, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }

        if (req.file) {
            await updateProductPicture(req, id, token.admin_id);
        }

        if (deletedIngredients || ingredients || updatedIngredients) {
            await updateProductMaterial(req, id, ingredients, deletedIngredients, updatedIngredients, token.admin_id);
        }
        if (deletedPackage || packages ) {
            await updateProductPackage(req, id, packages, deletedPackage, token.admin_id);
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
            updateQuery += "productpic_name = ?, updated_by = ? ";
            updateValues.push(req.file.filename, tokenId);
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

        //ตรวจสอบว่า ingredients ถูกส่งมาหรือไม่
        if (ingredients) {
            console.log("ingredients", ingredients);
            
            // ตรวจสอบและแปลงเป็นอาร์เรย์หากเป็นสตริง
            if (typeof ingredients === 'string') {
                ingredients = JSON.parse(ingredients);
            }

            if (!Array.isArray(ingredients)) {
                throw new Error("Ingredients is not an array");
            }

            //อัปเดตข้อมูลใน product_material
            const ingredientValues = ingredients.filter(item => item.quantity !== null).map(item => [uuidv4(), productId, item.material_id, item.quantity, tokenId]);

            //อัปเดตหรือเพิ่มข้อมูลที่ไม่ได้ถูกลบ
            if (ingredientValues.length > 0) {
                await new Promise((resolve, reject) => {
                    db.query("INSERT INTO product_material (product_material_Id, product_id, material_id, quantity, updated_by)"+
                        " VALUES ? ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), updated_by = VALUES(updated_by)", //ถ้ามีของที่ซ้ำกันให้เป็นการอัปเดตเเค่จำนวนเเละคนอัปเดต
                        [ingredientValues],
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
            }
        }

        return { message: "Product materials updated successfully" };
    } catch (error) {
        console.error("Error updating product materials:", error);
        throw error;
    }
};

const updateProductPackage = async (req, productId, packages, deletedPackage, tokenId) => {
    try {
        console.log("im here updateProductPackage",packages,deletedPackage);

        if (typeof deletedPackage === 'string') {
            deletedPackage = JSON.parse(deletedPackage);  // แปลงสตริงเป็นอาร์เรย์
        }
        
        console.log("deletedPackage after parsing:", deletedPackage);
        // ตรวจสอบว่ามีการส่ง deletedPackage มาและเป็นอาร์เรย์
        if (deletedPackage && Array.isArray(deletedPackage) && deletedPackage.length > 0) {
            console.log("Deleting materials:", deletedPackage);
            const deletedPackageId = deletedPackage.map(item => item.package_product_id); 
        
            if (deletedPackageId.length > 0) {
                await new Promise((resolve, reject) => {
                    db.query(
                        "DELETE FROM package_product WHERE product_id = ? AND package_product_id IN (?)", //ที่ต้องใช้ IN เพราะว่า Data เป็น Array เเละ = ไม่รองรับการลบเเบบหลายเเถวเเต่ IN รองรับ
                        [productId, deletedPackageId],
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
            }
        } else {
            console.log("No deleted packages or invalid format.");
        }

        //ตรวจสอบว่า packages ถูกส่งมาหรือไม่
        if (packages) {
            console.log("packages", packages);
            
            // ตรวจสอบและแปลงเป็นอาร์เรย์หากเป็นสตริง
            if (typeof packages === 'string') {
                packages = JSON.parse(packages);
            }

            if (!Array.isArray(packages)) {
                throw new Error("Ingredients is not an array");
            }

            //อัปเดตข้อมูลใน product_material
            const ingredientValues = packages.filter(item => item.quantity !== null).map(item => [uuidv4(), productId, item.package_id, tokenId]);

            //อัปเดตหรือเพิ่มข้อมูลที่ไม่ได้ถูกลบ
            if (ingredientValues.length > 0) {
                await new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO package_product (package_product_Id, product_id, package_id, created_by) VALUES ?",
                        [ingredientValues],
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
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

        await new Promise((resolve, reject) => {
            db.query('DELETE FROM package_product WHERE product_id = ?', [id], (err, result) => {
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