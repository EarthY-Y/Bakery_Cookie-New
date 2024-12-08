import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";

export const getListCategory = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT c.category_id, c.category_name, c.created_at, c.updated_at, a_created.userName AS created_by,"+
                    " a_updated.userName AS updated_by, COUNT(cp.category_product_id) AS amountCategoryProduct FROM product_category c"+
                    " LEFT JOIN admin a_created ON a_created.admin_id = c.created_by"+
                    " LEFT JOIN admin a_updated ON a_updated.admin_id = c.updated_by"+
                    " LEFT JOIN category_product cp ON cp.category_id = c.category_id"+
                    " GROUP BY c.category_id, c.category_name",
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product_category:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT c.*, cp.category_product_id, p.product_id, p.product_name, pp.productpic_name, a_created.username as created_by, a_updated.username as updated_by FROM product_category c"+
                    " LEFT JOIN category_product cp ON cp.category_id = c.category_id"+
                    " LEFT JOIN product p ON p.product_id = cp.product_id"+
                    " LEFT JOIN productpicture pp ON pp.product_id = p.product_id"+
                    " LEFT JOIN admin a_created ON a_created.admin_id = c.created_by"+
                    " LEFT JOIN admin a_updated ON a_updated.admin_id = c.updated_by"+
                    " WHERE c.category_id = ?"+
                    " GROUP BY p.product_name",
                    [id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log(results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product_category:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const craeteCategory = async (req, res) => {
    try {
        const idCategory = uuidv4() 
        const authHeader = req.headers['authorization']
        const token = await passToken(authHeader)
        const {categoryName,selectedProducts} = req.body
        console.log(categoryName,selectedProducts);
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO product_category (category_id, category_name, created_by) VALUES(?, ?, ?)", [idCategory, categoryName, token.admin_id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        if(results.lenght !== 0){
            await createCategoryProduct(idCategory, selectedProducts, token.admin_id)
            return res.status(200).json(results);
        }
        
    } catch (error) {
        console.error("Error create product_category:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

const createCategoryProduct = async (idCategory, selectedProducts, admin_id) => {
    if (typeof selectedProducts === 'string') {
        selectedProducts = JSON.parse(selectedProducts);
    }
    try {
        for (const item of selectedProducts) {
            const categoryProductId = uuidv4();
            const dataCategoryProduct = [categoryProductId, idCategory, item.product_id, admin_id];

            await new Promise((resolve, reject) => {
                db.query(
                    "INSERT INTO category_product (category_product_id, category_id, product_id, created_by) VALUES (?, ?, ?, ?)", 
                    dataCategoryProduct, 
                    (err, result) => { 
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
            });
        }
        // console.log('');
    } catch (error) {
        console.error('Error inserting product into category_product:', error);
        throw new Error('Error inserting product into category_product: ' + error.message);
    }
};

export const updateCategoryProduct = async (req, res) => {
    try {
        const idCategory = req.params.id
        const {changesCategoryProduct} = req.body
        const authHeader = req.headers['authorization']
        const token = await passToken(authHeader)
        if (typeof changesCategoryProduct === 'string') {
            changesCategoryProduct = JSON.parse(changesCategoryProduct);
        }
        console.log(idCategory, changesCategoryProduct);
        
        if(changesCategoryProduct.added.lenght !==0){
            for (const item of changesCategoryProduct.added) {
                const dataCategoryProduct = [uuidv4(), idCategory, item.product_id, token.admin_id];
                await new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO category_product (category_product_id, category_id, product_id, created_by) VALUES (?, ?, ?, ?) ", 
                        dataCategoryProduct, 
                        (err, result) => { 
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
            }
        }
        if(changesCategoryProduct.removed.lenght !==0){
            for (const item of changesCategoryProduct.removed) {
                await new Promise((resolve, reject) => {
                    db.query(
                        "DELETE FROM category_product WHERE category_id = ? and product_id =  ?", [idCategory, item.product_id], 
                        (err, result) => { 
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
            }
        }
        if(changesCategoryProduct.category_name){
            await new Promise((resolve, reject) => {
                db.query(
                    "UPDATE product_category SET category_name = ? WHERE category_id = ?", [changesCategoryProduct.category_name, idCategory], 
                    (err, result) => { 
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
            });
        }
        const results = await new Promise((resolve, reject) => {
            db.query(
                "UPDATE product_category SET updated_by = ? WHERE category_id = ?", [token.admin_id, idCategory], 
                (err, result) => { 
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
        return res.status(200).json(results);

    } catch (error) {
        console.error('Error inserting product into category_product:', error);
        res.status(400).json({ message: "Error edit product_category", error});
    }
};

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
        console.error("Error get productPicture:", error);
        res.status(400).json({ message: "Error get product picture", error});
    }
}