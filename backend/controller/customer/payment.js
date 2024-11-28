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
            db.query("SELECT addressId FROM address where created_by = ?;",[authToken.customerId],
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
            db.query("SELECT a.houseNo, a.zip_code, c.phone_number, c.f_name, c.l_name, p.province_nameTH, ap.amphure_nameTH, t.tambon_nameTH FROM address a"+
                    " INNER JOIN customer c ON c.customer_id = a.created_by"+
                    " INNER JOIN province p ON p.province_id = a.province_id"+
                    " INNER JOIN amphure ap ON ap.amphure_id = a.amphure_id"+
                    " INNER JOIN tambon t ON t.tambon_id = a.tambon_id  where a.created_by = ?;",[authToken.customerId],
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

export const getPorductCart = async (req, res) => {
    try {
        // console.log("im here getPricePorductCart");
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT cartId FROM cart c" +
                    " INNER JOIN status_cart sc ON sc.status_cart_id = c.status WHERE c.customer_id = ? AND sc.status_name = 'พร้อมใช้งาน' LIMIT 1;",
                     [authToken.customerId], 
                    (err, result) => { 
                        resolve(result)
                    })
        })
        const getCartId = results[0].cartId
        // console.log(getCartId);
        
        const resultsFindProductCart = await new Promise((resolve, reject)=> {          
            db.query("SELECT cp.cart_product_id, cp.cartId, cp.quantity, p.product_name, p.weight_per_piece, p.selling_price_per_quantity, pp.productpic_name FROM cart_product cp"+
                    " INNER JOIN product p ON cp.product_id = p.product_id "+
                    " INNER JOIN productpicture pp ON pp.product_id = p.product_id WHERE cp.cartId = ?", [getCartId],
                    (err, result) => { 
                resolve(result)
            })
        })
        
        res.status(200).json(resultsFindProductCart)
    }catch(error){
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}

export const getShippingRate = async (req, res) => {
    try {
        const {weight} = req.body
        console.log(weight);
        
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM shipping_rate WHERE weight_range_min <= ? AND weight_range_max >= ?",[weight, weight],
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
        
        const resultsFindStatusOrder = await new Promise((resolve, reject)=> {
            db.query("SELECT status_order_id FROM status_order WHERE status_name LIKE ? ",["รอ%"],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })

        const statusOrderId = resultsFindStatusOrder[0].status_order_id
        console.log(statusOrderId);
        
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO orders (orders_id, customer_id, cartId, quantity, price, status) VALUES (?, ?, ?, ?, ?, ?)",[orderId, authToken.customerId, cartItemId, totalQuantity, totalprice, statusOrderId],
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
//เปลี่ยนสถานะ สินค้าที่อยู่ใน ตะกร้าสินค้า
const updateStatusCartProduct = async (cartItemId) => {
    const resultsFindstatusCart = await new Promise((resolve, reject) => {
        db.query(
            "SELECT status_cart_id FROM Status_cart WHERE status_name LIKE ?",
            ["ทำรายการ%"],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
    const statusCart = resultsFindstatusCart[0].status_cart_id
    const results = await new Promise((resolve, reject) => {
        db.query(
            "UPDATE cart SET status = ? WHERE cartId = ?",
            [statusCart, cartItemId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });

    // return res.status(200).json(results);
};

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
                    " INNER JOIN status_order so ON so.status_order_id = o.status"+
                    " INNER JOIN cart_product cp ON c.cartId = cp.cartId"+
                    " INNER JOIN product p ON p.product_id = cp.product_id"+
                    " WHERE o.customer_id = ? AND so.status_name LIKE ? AND o.cartId = ?"+
                    " GROUP BY orders_id;", 
                    [authToken.customerId ,'รอ%', id],
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
        console.log(req.body);  
        const {totalPrice} = req.body
        console.log(totalPrice);
        
        const authHeader = req.headers['authorization'] //ส่ง token ผ่าน Header เเบบ Bearer 
        const authToken = await passToken(authHeader)
        if(!authToken){
            return res.status(404).json({ message: "User not found" });
        }
        console.log(id, statement_picture,req.body);
        const resultsFindStatusOrder = await new Promise((resolve, reject)=> {
            db.query("SELECT status_order_id FROM status_order WHERE status_name LIKE ?", ["ชำระ%"],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        const statusOrderId = resultsFindStatusOrder[0].status_order_id
        const results = await new Promise((resolve, reject)=> { //WHERE customer_id = ? and cartId = ? อาจจะเกิด cart_id ซ้ำกันได้อนาคตต้องเเก้ไปใช้ orders_id
            db.query("UPDATE orders SET price = ?, statement_picture = ?, status = ? WHERE customer_id = ? and cartId = ?", [totalPrice, statement_picture, statusOrderId, authToken.customerId, id],
                    (err, result) => { 
                        if (err) return reject(err)
                        resolve(result)
                    })
        })
        const resultsFindOrderById = await new Promise((resolve, reject)=> {
            db.query("SELECT orders_id FROM orders WHERE customer_id = ? and cartId = ?", [authToken.customerId, id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        const orderId = resultsFindOrderById[0].orders_id
        console.log("orderId",orderId);
        const resultsInsertHistory = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO order_status_history (history_id , orders_id, status_order_id, changed_by) VALUES (?, ?, ?, ?)",[uuidv4(), orderId, statusOrderId, authToken.customerId],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        res.status(200).json(resultsInsertHistory)
    }catch(error){
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error});
    }
}