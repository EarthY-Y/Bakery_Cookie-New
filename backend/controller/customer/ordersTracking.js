import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const getOrderslistWaitStatement = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT o.cartId, o.orders_id, o.quantity, o.price, so.status_name, o.created_at, o.updated_at FROM orders o INNER JOIN status_order so ON so.status_order_id = o.status"+
                " WHERE so.status_name LIKE ?"+
                " GROUP BY orders_id", ["รอ%"],
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

export const getOrderslistCheckOut = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT  o.orders_id, o.quantity, o.price, so.status_name, o.created_at, osh.change_time as updated_at FROM orders o "+
                " INNER JOIN status_order so ON so.status_order_id = o.status"+
                " LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id"+
                " WHERE so.status_name NOT LIKE ? AND so.status_name NOT LIKE ? AND so.status_name NOT LIKE ?"+
                " GROUP BY o.orders_id", ["รอ%","ยกเลิก%", "จัดส่ง%"],
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
export const getOrderslistCancel = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT  o.orders_id, o.quantity, o.price, so.status_name, o.created_at, osh.change_time as updated_at FROM orders o "+
                " INNER JOIN status_order so ON so.status_order_id = o.status"+
                " LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id"+
                " WHERE so.status_name LIKE ?"+
                " GROUP BY o.orders_id", ["ยกเลิก%"],
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
export const getOrderslistFinish = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT  o.orders_id, o.quantity, o.price, so.status_name, o.created_at, osh.change_time as updated_at FROM orders o "+
                " INNER JOIN status_order so ON so.status_order_id = o.status"+
                " LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id"+
                " WHERE so.status_name LIKE ?" +
                " GROUP BY o.orders_id", ["%สำเร็จ"],
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

export const getOrdersTrackingById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT o.orders_id, o.quantity, o.price, o.created_at, o.updated_by, o.updated_at, o.statement_picture, so.status_name as status, "+
                    " c.cartId, cp.quantity as productCartQuantity, p.product_name, pp.productpic_name FROM orders o"+
                    " LEFT JOIN status_order so ON so.status_order_id = o.status"+
                    " INNER JOIN cart c ON o.cartId = c.cartId"+
                    " INNER JOIN cart_product cp ON c.cartId = cp.cartId"+
                    " INNER JOIN product p ON p.product_id = cp.product_id"+
                    " INNER JOIN productpicture pp ON pp.product_id = p.product_id"+
                    " WHERE orders_id = ? "+
                    " GROUP BY o.orders_id;",[id],
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

export const getOrdersTrackingHistoryById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT osh.change_time, so.status_name FROM order_status_history osh"+
                    " INNER JOIN status_order so ON so.status_order_id = osh.status_order_id"+
                    " WHERE orders_id = ? ",[id],
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

export const getStatusOrdersTrackingById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT  o.orders_id, o.quantity, o.price, so.status_name, o.created_at, osh.change_time as updated_at FROM orders o "+
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
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
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
                    " WHERE orders_id = ? ",[id],
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
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}