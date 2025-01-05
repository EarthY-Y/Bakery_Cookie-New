import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const getProductCustomer = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT p.product_id, p.selling_price_per_quantity, p.quantity_per_time, p.product_name, 
                     pp.productpic_name FROM product p
                     INNER JOIN productpicture pp ON p.product_id = pp.product_id
                     WHERE p.is_active = ?`,["1"],
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

export const getProductById = async (req, res) => {
    const id = req.params.id
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_name, p.selling_price_per_quantity, p.description, pp.productpic_name  FROM product p "+ 
                     "INNER JOIN productpicture pp ON pp.product_id = p.product_id WHERE p.product_id = ? ",
                     [id], 
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const createCart = async (id) => {
    const cartId = uuidv4();
    try {
        const resultsFindStatusActive = await new Promise((resolve, reject)=> {
            db.query("SELECT status_cart_id FROM status_cart WHERE status_name LIKE ?",
                     ["พร้อม%"], 
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })

        const statusCartId = resultsFindStatusActive[0].status_cart_id
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO cart (cartId ,customer_id, status) VALUES(?, ?, ?)",
                     [cartId, id, statusCartId], 
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
    }
}

export const getCart = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT cartId FROM cart c" + 
                    " INNER JOIN status_cart sc ON sc.status_cart_id = c.status WHERE c.customer_id = ? AND sc.status_name = ? LIMIT 1;",
                     [authToken.customerId, "พร้อมใช้งาน"], 
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })
        if(results.length === 0) {
            // console.log("resultsCreateProduct");
            
            await createCart(authToken.customerId)
            const resultsCreateProduct = await new Promise((resolve, reject)=> {
                db.query("SELECT cartId FROM cart c" + 
                        " INNER JOIN status_cart sc ON sc.status_cart_id = c.status WHERE c.customer_id = ? AND sc.status_name = ? LIMIT 1;",
                         [authToken.customerId, "พร้อมใช้งาน"], 
                        (err, result) => { 
                            if (err) return reject(err)
                            resolve(result)
                        })
            })
            return res.status(200).json(resultsCreateProduct);
        }
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const createPorductCart = async (req, res) => {
    try {
        console.log("req.body = ", req.body);
        const id  = uuidv4();
        const {productId, cartId, selling_price_per_quantity, quantity} = req.body
        console.log(productId, cartId, selling_price_per_quantity, quantity);
        const resultsFindProductCart = await new Promise((resolve, reject)=> {
            db.query("SELECT cart_product_id, quantity FROM cart_product WHERE cartId = ? AND product_id = ?", [cartId, productId],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })

        if(resultsFindProductCart.length === 0){
            // console.log("resultsCreateProductCart");
            const resultsCreateProductCart = await new Promise((resolve, reject)=> {
                db.query("INSERT INTO cart_product (cart_product_id, product_id, cartId, quantity, price)  VALUES (?, ?, ?, ?, ?)",
                    [id, productId, cartId, quantity, selling_price_per_quantity],
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
            })
            return res.status(200).json(resultsCreateProductCart);
        }else if (resultsFindProductCart.length > 0) {
            // console.log("resultsUpdateProductCart",typeof(quantity), "cartProductId = ", cartProductId);
            const cartProductId = resultsFindProductCart[0].cart_product_id;
            const existingQuantity = resultsFindProductCart[0].quantity;

            const quantityInt = parseInt(quantity)
            const resultsUpdateProductCart = await new Promise((resolve, reject)=> {
                db.query("UPDATE cart_product SET quantity = quantity + ?, price = ? WHERE cart_product_id = ?", [quantity, selling_price_per_quantity, cartProductId],
                        (err, result) => {  
                        if (err) return reject(err)
                        resolve(result)
                    })
            })
            return res.status(200).json(resultsUpdateProductCart);
        }else {
            throw new Error("query createPorductCart error")
        }
        
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const updatePorductCart = async (req, res) => {
    try {
        console.log("req.body = ", req.body);
        const {cart_product_id, status, value} = req.body
        if(status === "add"){
            console.log("add");
            const resultsUpdateProductCart = await new Promise((resolve, reject)=> {
                db.query("UPDATE cart_product SET quantity = quantity + ? WHERE cart_product_id = ?", [value,cart_product_id],
                        (err, result) => {  
                        if (err) return reject(err)
                        resolve(result)
                    })
            })
            return res.status(200).json(resultsUpdateProductCart);
        }else if(status === "minus"){
            console.log("minus");
            const resultsUpdateProductCart = await new Promise((resolve, reject)=> {
                db.query("UPDATE cart_product SET quantity = quantity - ? WHERE cart_product_id = ?", [value,cart_product_id],
                        (err, result) => {  
                        if (err) return reject(err)
                        resolve(result)
                    })
            })
            return res.status(200).json(resultsUpdateProductCart);
        }else if(status === "input"){
            console.log("input");
            const resultsUpdateProductCart = await new Promise((resolve, reject)=> {
                db.query("UPDATE cart_product SET quantity = ? WHERE cart_product_id = ?", [value,cart_product_id],
                        (err, result) => {  
                        if (err) return reject(err)
                        resolve(result)
                    })
            })
            return res.status(200).json(resultsUpdateProductCart);
        }

    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}

export const deleteProductCart = async (req, res) => {
    const id = req.params.id
    console.log(id);
    
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("DELETE FROM cart_product WHERE cart_product_id  = ?",[id],
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })
        res.status(200).json(results)
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error});
    }
}

export const getNavbarCategory = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT category_name, product_category_id FROM product_category`,
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

export const getCategoryProduct = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT p.*, pp.productpic_name FROM product p 
                      LEFT JOIN category_product cp ON cp.product_id = p.product_id
                      LEFT JOIN product_category pc ON pc.product_category_id = cp.product_category_id
                      LEFT JOIN productpicture pp ON p.product_id = pp.product_id
                      WHERE pc.category_name = ?`, [id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        res.status(400).json({ message: "มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล", error });
    }
}