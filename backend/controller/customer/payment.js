import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";
import {createCart} from "./product.js"

export const validateCustomerAddress = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT addressId FROM address where customer_id = ?;",[authToken.customerId],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log("results",results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const getCustomerAddress = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT a.houesNo, a.zip_code, c.phone_number, c.f_name, c.l_name, p.province_nameTH, ap.amphure_nameTH, t.tambon_nameTH FROM address a"+
                    " INNER JOIN customer c ON c.customer_id = a.customer_id"+
                    " INNER JOIN province p ON p.province_id = a.province_id"+
                    " INNER JOIN amphure ap ON ap.amphure_id = a.amphure_id"+
                    " INNER JOIN tambon t ON t.tambon_id = a.tambon_id  where a.customer_id = ?;",[authToken.customerId],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        // console.log("results",results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}

export const createOrders = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        console.log(req.body);
        const orderId = uuidv4()
        let cartItem = req.body.productCart;
        const totalprice = req.body.totalprice

        const totalQuantity = req.body.totalQuantity
        if (typeof cartItem === 'string') {
            cartItem = JSON.parse(cartItem);
        }

        if (!Array.isArray(cartItem)) {
            throw new Error("cartItem is not an array");
        }

        const cartItemId = req.body.productCart[0]?.cartId;
        console.log(cartItemId);
        
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO orders (orders_id, customer_id, cartId, quantity, price, status) VALUES (?, ?, ?, ?, ?, ?)",[orderId, authToken.customerId, cartItemId, totalQuantity, totalprice, "wait for stament"],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        if(results){
            await updateStatusCartProduct(cartItemId)
            await createCart(authToken.customerId)
            return res.status(200).json(results);
        }else{
            return res.status(400).json({ message: "Error create order" });
        }
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}

const updateStatusCartProduct = async (cartItemId) => {
    const results = await new Promise((resolve, reject)=> {
        db.query("UPDATE cart SET status = ? WHERE cartId = ?",["check out",cartItemId],
                (err, result) => { 
            if (err) return reject(err)
            resolve(result)
        })
    })
    // console.log("results",results);
    // return res.status(200).json(results);
}

export const getPaymentOrders = async (req, res) => {
    try {
        const id = req.params.id
        console.log("id",id);
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        
        const resultsFindOrders = await new Promise((resolve, reject)=> {          
            db.query("SELECT o.orders_id, o.quantity, o.price FROM orders o"+
                    " INNER JOIN cart c ON o.cartId = c.cartId"+
                    " INNER JOIN cart_product cp ON c.cartId = cp.cartId"+
                    " INNER JOIN product p ON p.product_id = cp.product_id"+
                    " WHERE o.customer_id = ? AND o.status = ? AND o.cartId = ?"+
                    " GROUP BY orders_id;", 
                    [authToken.customerId ,'wait for stament', id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log(resultsFindOrders);
        
        res.status(200).json(resultsFindOrders)
    }catch(error){
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const updatePaymentOrder = async (req, res) => {
    try {
        console.log("updatePaymentOrder");
        
        const id = req.params.id
        const statement_picture = req.file.filename;
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        console.log(id, statement_picture);
        
        const results = await new Promise((resolve, reject)=> {
            db.query("UPDATE orders SET statement_picture = ?, status = ? WHERE customer_id = ? and cartId = ?", [statement_picture, 'check out', authToken.customerId, id],
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })
        res.status(200).json(results)
    }catch(error){
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}