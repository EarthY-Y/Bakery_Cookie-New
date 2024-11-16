import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const getProductCustomer = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_id, p.selling_price_per_quantity, p.quantity_per_time, p.product_name, pp.productpic_name FROM product p"+
                    " INNER JOIN productpicture pp ON p.product_id = pp.product_id",
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
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
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}

export const createCart = async (id) => {
    const cartId = uuidv4();
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO cart (cartId ,customer_id, status) VALUES(?, ?, ?)",
                     [cartId, id, "cart-พร้อมใช้งาน"], 
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })
    } catch (error) {
        console.error("Error get product:", error);
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
            db.query("SELECT cartId FROM cart WHERE customer_id = ? AND status = 'cart-พร้อมใช้งาน' LIMIT 1;",
                     [authToken.customerId], 
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })
        if(results.length === 0) {
            // console.log("resultsCreateProduct");
            
            await createCart(authToken.customerId)
            const resultsCreateProduct = await new Promise((resolve, reject)=> {
                db.query("SELECT cartId FROM cart WHERE customer_id = ? AND status = 'cart-พร้อมใช้งาน' LIMIT 1;",
                         [authToken.customerId], 
                        (err, result) => { 
                            if (err) return reject(err)
                            resolve(result)
                        })
            })
            return res.status(200).json(resultsCreateProduct);
        }
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
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
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
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
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}

export const getPorductCart = async (req, res) => {
    try {
        // console.log("im here getPricePorductCart");
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT cartId FROM cart WHERE customer_id = ? AND status = 'cart-พร้อมใช้งาน' LIMIT 1;",
                     [authToken.customerId], 
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })
        const getCartId = results[0].cartId
        // console.log(getCartId);
        
        const resultsFindProductCart = await new Promise((resolve, reject)=> {          
            db.query("SELECT cp.cart_product_id, cp.cartId, cp.quantity, p.product_name, p.selling_price_per_quantity, pp.productpic_name FROM cart_product cp"+
                    " INNER JOIN product p ON cp.product_id = p.product_id "+
                    " INNER JOIN productpicture pp ON pp.product_id = p.product_id WHERE cp.cartId = ?", [getCartId],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        res.status(200).json(resultsFindProductCart)
    }catch(error){
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error});
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
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}