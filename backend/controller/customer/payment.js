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
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT a.houseNo, a.zip_code, c.phone_number, c.f_name, c.l_name, p.province_nameTH, ap.amphure_nameTH, t.tambon_nameTH FROM address a
                      LEFT JOIN customer c ON c.customer_id = a.created_by
                      LEFT JOIN province p ON p.province_id = a.province_id
                      LEFT JOIN amphure ap ON ap.amphure_id = a.amphure_id
                      LEFT JOIN tambon t ON t.tambon_id = a.tambon_id  
                      where a.created_by = ?;`,[authToken.customerId],
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
                    " INNER JOIN status_cart sc ON sc.status_cart_id = c.status WHERE c.customer_id = ? AND sc.status_name = ? LIMIT 1;",
                     [authToken.customerId, "พร้อมใช้งาน"], 
                    (err, result) => { 
                        resolve(result)
                    })
        })
        const getCartId = results[0].cartId
        // console.log(getCartId);
        
        const resultsFindProductCart = await new Promise((resolve, reject)=> {          
            db.query("SELECT cp.cart_product_id, cp.cartId, cp.quantity,p.product_id, p.product_name, p.weight_per_piece, p.selling_price_per_quantity, pp.productpic_name FROM cart_product cp"+
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
            db.query(`SELECT sr.*, p.package_name, p.cost_per_quantity FROM shipping_rate sr 
                     LEFT JOIN package p ON p.package_id = sr.package_id
                     WHERE weight_range_min <= ? AND weight_range_max >= ? AND sr.is_active = ? AND p.is_active = ?`,[weight, weight, "1", "1"],
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
        console.log(cartItem);
        
        const {totalPrice, totalPriceProduct, shippingRate, cost_package_per_quantity ,totalQuantity, shipping_rate_id, houseNo, tambon, amphure, province, zip_code} = req.body
        console.log(totalPrice, totalPriceProduct, shippingRate, cost_package_per_quantity,totalQuantity, shipping_rate_id, houseNo, tambon, amphure, province, zip_code);
        
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
            db.query("INSERT INTO orders (orders_id, customer_id, cartId, quantity, total_price_product, status, shipping_rate_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [orderId, authToken.customerId, cartItemId, totalQuantity, totalPriceProduct, statusOrderId, shipping_rate_id],
                (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                }
            )
        })

        if(results){
            const resultsInsertAddressOrder = await new Promise((resolve, reject)=> {
                db.query("INSERT INTO order_address (order_address_id, orders_id, house_no, tambon_name, amphure_name, 	province_name, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?)",[uuidv4(), orderId, houseNo, tambon, amphure, province, zip_code],
                        (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                })
            })
            await updateStatusCartProduct(cartItemId)
            await detailCostProduct(req, cartItem, cartItemId, orderId, totalQuantity)
            await createCart(authToken.customerId)
            return res.status(200).json(results);
        }else{
            return res.status(400).json({ message: "Error create order" });
        }
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error createOrders", error });
    }
}

const detailCostProduct = async (req, cartItem, cartItemId, orderId, totalQuantity) => {
    try {
        const orderCostDetailsId = uuidv4()
        const {totalPriceProduct, shippingRate, cost_package_per_quantity, totalPrice} = req.body
        console.log(totalPriceProduct, shippingRate, cost_package_per_quantity, totalPrice);
        const resultsFindCostPrdoductInCart = await new Promise((resolve, reject) => {
            db.query("SELECT p.product_id, sum(m.cost_per_quantity * pm.quantity) / p.quantity_per_time as cost_product FROM cart c"+
                    " LEFT JOIN cart_product cp ON cp.cartId = c.cartId"+
                    " LEFT JOIN product p ON cp.product_id = p.product_id"+
                    " LEFT JOIN product_material pm ON pm.product_id = p.product_id"+
                    " LEFT JOIN material m ON m.material_id = pm.material_id"+
                    " WHERE c.cartId = ? GROUP BY p.product_id",[cartItemId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
        console.log(resultsFindCostPrdoductInCart);
        const resultCalculateTotalCost = calculateTotalCost(cartItem, resultsFindCostPrdoductInCart);
        console.log(resultCalculateTotalCost);

        const totalCostProduct = resultCalculateTotalCost.reduce((acc, item) => acc + parseFloat(item.totalCostPerProduct), 0);
        console.log("totalCostProduct "+ totalCostProduct);
    
        const costOrder = totalCostProduct  + shippingRate + cost_package_per_quantity;
        console.log("costOrder "+ costOrder.toFixed(3));
    
        const profit = totalPrice - costOrder 
        console.log("profit "+ profit.toFixed(3));
        
        if(totalCostProduct){
            const results = await new Promise((resolve, reject) => {
                db.query("INSERT INTO order_cost_details (order_cost_details_id, orders_id, cost_shipping, cost_package, total_cost) VALUES(?, ?, ?, ?, ?)",
                    [orderCostDetailsId, orderId, shippingRate, cost_package_per_quantity, costOrder],
                    (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
            });
            if (results) {
                const costProductDetails = resultCalculateTotalCost.map( item =>[uuidv4(), orderCostDetailsId, item.product_id, item.costPerUnit, item.quantity, item.totalCostPerProduct])
                const resultsInsertCostProductDeatails = await new Promise((resolve, reject) => {
                    db.query("INSERT INTO cost_product_detaails (cost_product_detaails_id, order_cost_details_id, product_id, cost_product, quantity, total_product_cost) VALUES ?",
                        [costProductDetails],
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
                await detailProfit(totalPrice, profit, orderId)
            }
        }
    } catch (error) {
        console.error("Error detailCostProduct:", error);
    }
};

const detailProfit = async (totalPrice, profit, orderId) => {
    console.log(totalPrice, profit, orderId);
    try {
        const resultsFindstatusCart = await new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO order_profit (order_profit_id, orders_id, selling_price, profit) VALUES(?, ?, ?, ?)",
                [uuidv4(), orderId, totalPrice, profit],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    } catch (error) {
        console.error("Error detailProfit:", error);
    }
    // return res.status(200).json(results);
};

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
            db.query("SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, ocd.cost_package, ocd.cost_shipping, ocd.cost_package FROM orders o"+
                    " LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id"+
                    " INNER JOIN cart c ON o.cartId = c.cartId"+
                    " INNER JOIN status_order so ON so.status_order_id = o.status"+
                    " INNER JOIN cart_product cp ON c.cartId = cp.cartId"+
                    " INNER JOIN product p ON p.product_id = cp.product_id"+
                    " WHERE o.customer_id = ? AND so.status_name LIKE ? AND o.cartId = ?"+
                    " GROUP BY o.orders_id;", 
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
            db.query("UPDATE orders SET statement_picture = ?, status = ? WHERE customer_id = ? and cartId = ?", [statement_picture, statusOrderId, authToken.customerId, id],
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

const calculateTotalCost = (cartItem, costData) => {
    const costMap = costData.reduce((acc, item) => {
        acc[item.product_id] = item.cost_product; // สร้าง map ของ cost_product โดยใช้ product_id เป็น key
        return acc;
    }, {}); //{} ให้เป็น object เปล่า ค่าเริ่มต้น

    // คำนวณต้นทุนรวมสำหรับสินค้าทั้งหมดใน cartItem
    return cartItem.map(item => {
        // หาค่าต้นทุนของแต่ละสินค้าโดยใช้ product_id
        const costPerUnit = costMap[item.product_id];

        // ถ้ามี cost_product สำหรับสินค้า
        if (costPerUnit !== undefined) {
            const totalCost = costPerUnit * item.quantity; // คูณจำนวนที่สั่งซื้อ
            return {
                ...item,
                costPerUnit: costPerUnit,
                totalCostPerProduct: totalCost // เพิ่มข้อมูล totalCost สำหรับสินค้านั้น
            };
        }

        // ถ้าไม่พบ cost_product สำหรับสินค้า
        return {
            ...item,
            totalCost: 0 // หรือสามารถ throw error ถ้าจำเป็น
        };
    });
};