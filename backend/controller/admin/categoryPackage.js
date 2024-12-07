import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";

export const getListCategoryPackage = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT pc.package_category_id, pc.package_category_name, COUNT(c.package_id) as amountCategoryPackage, pc.created_at, pc.updated_at, a_created.userName AS created_by,"+
                    " a_updated.userName AS updated_by FROM package_category pc"+
                    " LEFT JOIN category_package c ON c.package_category_id = pc.package_category_id"+
                    " LEFT JOIN admin a_created ON a_created.admin_id = pc.created_by"+
                    " LEFT JOIN admin a_updated ON a_updated.admin_id = pc.updated_by"+
                    " GROUP BY c.package_category_id, pc.package_category_name",
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

export const getCategoryPackageById = async (req, res) => {
    try {
        const id = req.params.id

        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT pc.package_category_id, pc.package_category_name, cp.package_id, p.package_id,"+
                    " p.package_name, p.package_pic, a_created.userName as created_by, a_updated.userName as updated_by,"+
                    " pc.created_at, pc.updated_at FROM package_category pc"+
                    " LEFT JOIN category_package cp ON cp.package_category_id = pc.package_category_id"+
                    " LEFT JOIN package p ON p.package_id = cp.package_id"+
                    " LEFT JOIN admin a_created ON a_created.admin_id = pc.created_by"+
                    " LEFT JOIN admin a_updated ON a_updated.admin_id = pc.updated_by"+
                    " WHERE pc.package_category_id = ?",[id],
                (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                }
            )
        })
        console.log(results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get category:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const craetePacakageCategory = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = await passToken(authHeader)
        const {categoryName, selectedPackage} = req.body
        console.log(categoryName, selectedPackage);
        const PackageCategoryId = uuidv4();

        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO package_category (package_category_id, package_category_name, created_by) VALUES(?, ?, ?)", [PackageCategoryId, categoryName, token.admin_id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })

        if(results.lenght !== 0){
            await createCategoryPackage(PackageCategoryId, selectedPackage, token.admin_id)
            return res.status(200).json(results);
        }
        return res.status(200).json('create package successfully ');

    } catch (error) {
        console.error("Error create category:", error);
        res.status(400).json({ message: "Error create package", error});
    }
}

const createCategoryPackage = async (idCategory, selectedPackage, admin_id) => {
    if (typeof selectedPackage === 'string') {
        selectedPackage = JSON.parse(selectedPackage);
    }
    try {
        for (const item of selectedPackage) {
            const categoryPackageId = uuidv4();
            const dataCategoryProduct = [categoryPackageId, idCategory, item.package_id, admin_id];

            await new Promise((resolve, reject) => {
                db.query(
                    "INSERT INTO category_package (category_package_id, package_category_id, package_id, created_by) VALUES (?, ?, ?, ?)", 
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

export const updateCategoryPackage = async (req, res) => {
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
                const dataCategoryProduct = [uuidv4(), idCategory, item.package_id, token.admin_id];
                await new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO category_package (category_package_id, package_category_id , package_id, created_by) VALUES (?, ?, ?, ?) ", 
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
                        "DELETE FROM category_package WHERE package_category_id = ? and package_id =  ?", [idCategory, item.package_id], 
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
                    "UPDATE package_category SET package_category_name = ?, updated_by = ? WHERE package_category_id = ?", [changesCategoryProduct.category_name, token.admin_id, idCategory], 
                    (err, result) => { 
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
            });
        }
        const results = await new Promise((resolve, reject) => {
            db.query(
                "UPDATE package_category SET updated_by = ? WHERE package_category_id = ?", [token.admin_id, idCategory], 
                (err, result) => { 
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
        return res.status(200).json(results);

    } catch (error) {
        console.error('Error inserting product into category_product:', error);
        res.status(400).json({ message: "Error edit category", error});
    }
};

export const deleteCategoryPackage = async (req, res) => {
    try {
        const id = req.params.id
        const {skip} = req.body
        console.log(id, skip);
        if(!skip){
            const results = await new Promise((resolve, reject) => {
                db.query(
                    "DELETE FROM package_category WHERE package_category_id = ?", [id], 
                    (err, result) => { 
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
            });
            console.log(results);
            return res.status(200).json(results)
        }
        console.log(skip);
        const results = await new Promise((resolve, reject) => {
            db.query(
                "DELETE FROM category_package WHERE package_category_id = ?", [id], 
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
                    "DELETE FROM package_category WHERE package_category_id = ?", [id], 
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

// export const deleteCategoryPackage = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { skip } = req.body;
//         console.log(id, skip);
//         const results = await new Promise((resolve, reject) => {
//             db.query(
//                 "DELETE FROM package_category WHERE package_category_id = ?", [id],
//                 (err, result) => {
//                     if (err) return reject(err);
//                     resolve(result);
//                 }
//             );
//         });

//         console.log(results);
//         res.status(200).json({ message: "Category package deleted successfully" });
//     } catch (error) {
//         console.error('Error delete category_product:', error);

//         if (error.sqlState === '23000') {
//             // Foreign key constraint error
//             res.status(409).json({
//                 message: "ไม่สามารถลบได้ เพราะยังถูกนำไปใช้อยู่",
//                 error: error.sqlMessage,
//             });
//         } else {
//             // General error
//             res.status(400).json({ message: "Error delete category_product", error });
//         }
//     }
// };