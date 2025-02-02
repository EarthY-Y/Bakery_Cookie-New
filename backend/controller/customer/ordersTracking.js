import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const getOrderslistWaitStatement = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.cartId, o.orders_id, o.quantity, o.total_price_product + COALESCE(ocd.cost_shipping, 0) + COALESCE(ocd.cost_package, 0)as price, so.status_name, o.created_at, o.updated_at FROM orders o 
                     LEFT JOIN customer c ON c.customer_id = o.customer_id
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     INNER JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_profit op ON op.orders_id = o.orders_id
                     WHERE so.status_name LIKE ? AND c.customer_id = ? 
                     GROUP BY o.orders_id
                     ORDER BY o.created_at DESC`, ["รอ%", token.customerId],
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

export const getOrderslistCheckOut = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader)
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product + COALESCE(ocd.cost_shipping, 0) + COALESCE(ocd.cost_package, 0) as price, 
                     so.status_name, o.created_at, osh.change_time as updated_at FROM orders o
                     LEFT JOIN customer c ON c.customer_id = o.customer_id
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     INNER JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                     WHERE so.status_name NOT LIKE ? AND so.status_name NOT LIKE ? AND so.status_name NOT LIKE ? AND c.customer_id = ? 
                     GROUP BY o.orders_id
                     ORDER BY o.created_at DESC`, ["รอ%","ยกเลิก%", "จัดส่ง%", token.customerId],
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
export const getOrderslistCancel = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader)
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT  o.orders_id, o.quantity, o.total_price_product + COALESCE(ocd.cost_shipping, 0) + COALESCE(ocd.cost_package, 0)as price, 
                 so.status_name as status, o.created_at, osh.change_time as updated_at, osh.note  FROM orders o
                 LEFT JOIN customer c ON c.customer_id = o.customer_id
                 LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                 INNER JOIN status_order so ON so.status_order_id = o.status
                 LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                 WHERE so.status_name LIKE ? AND c.customer_id = ? 
                 GROUP BY o.orders_id
                 ORDER BY o.created_at DESC`, ["ยกเลิก%", token.customerId],
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
export const getOrderslistFinish = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader)
        const results = await new Promise((resolve, reject)=> {  
            db.query(`SELECT  o.orders_id, o.quantity, o.total_price_product + COALESCE(ocd.cost_shipping, 0) + COALESCE(ocd.cost_package, 0)as price, 
                     so.status_name, o.created_at, osh.change_time as updated_at FROM orders o 
                     LEFT JOIN customer c ON c.customer_id = o.customer_id
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     INNER JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                     WHERE so.status_name LIKE ? AND c.customer_id = ? 
                     GROUP BY o.orders_id
                     ORDER BY o.created_at DESC`, ["%สำเร็จ", token.customerId],
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

export const getOrdersTrackingById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, ocd.cost_package, o.created_at, 
                     o.updated_by, o.updated_at, o.statement_picture, o.post_code, so.status_name as status, osh.note,
                     c.cartId, cp.quantity as productCartQuantity, p.product_name, pp.productpic_name FROM orders o
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                     LEFT JOIN status_order so ON so.status_order_id = o.status
                     INNER JOIN cart c ON o.cartId = c.cartId
                     INNER JOIN cart_product cp ON c.cartId = cp.cartId
                     INNER JOIN product p ON p.product_id = cp.product_id
                     INNER JOIN productpicture pp ON pp.product_id = p.product_id
                     WHERE o.orders_id = ? 
                     GROUP BY o.orders_id
                     ORDER BY o.orders_id DESC;`,[id],
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

export const getOrdersTrackingHistoryById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT osh.change_time, so.status_name FROM order_status_history osh
                     INNER JOIN status_order so ON so.status_order_id = osh.status_order_id
                     WHERE orders_id = ? 
                     GROUP BY change_time
                     ORDER BY change_time DESC`,[id],
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

export const getStatusOrdersTrackingById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT  o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, ocd.cost_package, so.status_name, o.created_at, osh.change_time as updated_at FROM orders o "+
                     " LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id"+
                     " INNER JOIN status_order so ON so.status_order_id = o.status"+
                     " LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id"+
                     " WHERE so.status_name NOT LIKE ? ", ["รอ%"],
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

export const getOrdersProductTrackingById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT cp.quantity as productCartQuantity, cp.price as productCartPrice, p.product_name, pp.productpic_name FROM orders o"+
                    " INNER JOIN cart c ON o.cartId = c.cartId"+
                    " INNER JOIN cart_product cp ON c.cartId = cp.cartId"+
                    " INNER JOIN product p ON p.product_id = cp.product_id"+
                    " INNER JOIN productpicture pp ON pp.product_id = p.product_id"+
                    " WHERE o.orders_id = ? ",[id],
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

export const getOrderTrackingAddress = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT oa.house_no, oa.zip_code, c.phone_number, c.f_name, c.l_name, oa.province_name, oa.amphure_name, oa.tambon_name FROM order_address oa
                      LEFT JOIN orders o ON o.orders_id = oa.orders_id
                      LEFT JOIN customer c ON c.customer_id = o.customer_id
                      where o.orders_id = ? `,[id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get order address:", error);
        res.status(400).json({ message: "Error get order address", error });
    }
}

export const getStatusListForCancelOrders = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT so.status_name FROM status_order so 
                     LEFT JOIN category_status_order cso ON cso.category_status_order_id = so.category_status_order_id
                     WHERE so.is_active = 1 AND cso.category_status_order_name LIKE ?`, ["รอดำ%"],
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

export const cancleOrder = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const idOrder = req.params.id
        const {reason} = req.body
        const resultsFindCancelStatusOrder = await new Promise((resolve, reject)=> {
            db.query("SELECT status_order_id FROM status_order WHERE status_name LIKE ?", ["ยกเลิก%"],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        const cancelStatusId = resultsFindCancelStatusOrder[0].status_order_id
        const resultsOrderStatusHistory = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO order_status_history (history_id, orders_id, status_order_id, changed_by, note) VALUES(?, ?, ?, ?, ?)", [uuidv4(), idOrder, cancelStatusId, token.customerId, reason],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })

        const results = await new Promise((resolve, reject)=> {
            db.query("UPDATE orders SET status = ?, updated_by = ? WHERE orders_id = ?", [cancelStatusId, token.customerId, idOrder],
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

export const getStatusOrderslist = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT * FROM status_order WHERE is_active = 1`,
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

export const getOrderslistById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product as price, o.cartId, ocd.cost_shipping, 
                     ocd.cost_package, so.status_name, o.created_at, osh.change_time as updated_at,
                     osh.note, CONCAT(f_name, ' ', l_name)  as fullname FROM orders o 
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     INNER JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                     LEFT JOIN customer c ON c.customer_id = o.customer_id
                     WHERE so.status_name = ?
                     GROUP BY o.orders_id
                     ORDER BY o.created_at DESC;`, [id],
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