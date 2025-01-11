import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";

export const getListCategoryOrderStatus = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT COUNT(so.category_status_order_id) as amountStatusOrders, cso.category_status_order_name, cso.category_status_order_id,
                     cso.category_status_order_name, a_created.userName as created_by, cso.updated_at, cso.created_at, a_updated.userName as updated_by FROM status_order so
                     LEFT JOIN category_status_order cso  ON cso.category_status_order_id = so.category_status_order_id
                     LEFT JOIN admin a_created ON a_created.admin_id = cso.created_by
                     LEFT JOIN admin a_updated ON a_updated.admin_id = cso.updated_by
                     WHERE so.category_status_order_id IS NOT NULL
                     GROUP BY so.category_status_order_id`,
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get ListCategoryStatus:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const getStatusOrderslist = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT * FROM status_order WHERE is_active = 1 AND category_status_order_id IS NULL `,
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log("results",results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const getCategoryStatusById = async (req, res) => {
    try {
        const id = req.params.id

        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT so.* ,cso.category_status_order_name, cso.created_at, cso.updated_at,
                     a_updated.userName as userNameUpdate, a_created.userName as userNameCreate FROM status_order so 
                     LEFT JOIN category_status_order cso ON cso.category_status_order_id = so.category_status_order_id
                     LEFT JOIN admin a_created ON a_created.admin_id = cso.created_by 
                     LEFT JOIN admin a_updated ON a_updated.admin_id = cso.updated_by 
                     WHERE so.is_active = 1 AND so.category_status_order_id = ? `,[id],
                (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                }
            )
        })
        // console.log(results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get CategoryStatusById:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const craetePacakageCategory = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = await passToken(authHeader)
        const {categoryName, selectedorderStatus} = req.body
        console.log(categoryName, selectedorderStatus);
        const CategoryStatusOrderId = uuidv4();

        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO category_status_order (category_status_order_id, category_status_order_name, created_by) VALUES(?, ?, ?)", [CategoryStatusOrderId, categoryName, token.admin_id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })

        if(results.lenght !== 0){
            await createCategoryStatus(CategoryStatusOrderId, selectedorderStatus, token.admin_id)
            return res.status(200).json(results);
        }
        return res.status(200).json('create Status successfully ');

    } catch (error) {
        console.error("Error create PacakageCategory:", error);
        res.status(400).json({ message: "Error create Status", error});
    }
}

const createCategoryStatus = async (idCategory, selectedorderStatus, admin_id) => {
    if (typeof selectedorderStatus === 'string') {
        selectedorderStatus = JSON.parse(selectedorderStatus);
    }
    try {
        for (const item of selectedorderStatus) {
            const dataCategoryProduct = [idCategory, admin_id, item.status_order_id];

            await new Promise((resolve, reject) => {
                db.query(
                    "UPDATE status_order SET category_status_order_id = ?, updated_by = ? WHERE status_order_id = ? ", 
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

export const updateCategoryStatus = async (req, res) => {
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
                const dataCategoryProduct = [idCategory, token.admin_id, item.status_order_id];
                await new Promise((resolve, reject) => {
                    db.query(
                        "UPDATE status_order SET category_status_order_id = ?, updated_by = ? WHERE status_order_id = ?", 
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
                        "UPDATE status_order SET category_status_order_id = ? WHERE status_order_id = ?", [null, item.status_order_id], 
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
                    "UPDATE category_status_order SET category_status_order_name = ? WHERE category_status_order_id = ?", [changesCategoryProduct.category_name, idCategory], 
                    (err, result) => { 
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
            });
        }
        const results = await new Promise((resolve, reject) => {
            db.query(
                "UPDATE category_status_order SET updated_by = ? WHERE category_status_order_id = ?", [token.admin_id, idCategory], 
                (err, result) => { 
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
        return res.status(200).json(results);

    } catch (error) {
        console.error('Error inserting product into category_product:', error);
        res.status(400).json({ message: "Error edit category_product", error});
    }
};

export const deleteCategoryStatus = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject) => {
            db.query(
                "UPDATE status_order SET category_status_order_id = NULL WHERE category_status_order_id = ?", [id], 
                (err, result) => { 
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
        console.log(results);
        if(results){
            const results = await new Promise((resolve, reject) => {
                db.query(
                    "DELETE FROM category_status_order WHERE category_status_order_id = ?", [id], 
                    (err, result) => { 
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
            });
            console.log(results);
            return res.status(200).json(results)
        }

    } catch (error) {
        console.error('Error delete category_product:', error);
        res.status(400).json({ message: "ต้องการลบจริงๆใช่ไหม?", error});
    }
};