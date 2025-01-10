import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const getOrderslistSuccessStatement = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product + COALESCE(ocd.cost_shipping, 0) + COALESCE(ocd.cost_package, 0)as price, 
                op.profit, so.status_name, o.created_at, osh.change_time as updated_at, CONCAT(f_name, ' ', l_name)  as fullname FROM orders o 
                LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                LEFT JOIN customer c ON c.customer_id = o.customer_id
                LEFT JOIN order_profit op ON op.orders_id = o.orders_id
                INNER JOIN status_order so ON so.status_order_id = o.status
                LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                WHERE so.status_name LIKE ?
                GROUP BY o.orders_id
                ORDER BY o.created_at DESC;`, ["%สำเร็จ%"],
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

export const getOrderslistHistoryCancel = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, ocd.cost_package, so.status_name, 
                o.created_at, osh.change_time as updated_at, CONCAT(f_name, ' ', l_name)  as fullname FROM orders o 
                LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                LEFT JOIN customer c ON c.customer_id = o.customer_id
                INNER JOIN status_order so ON so.status_order_id = o.status
                LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                WHERE so.status_name LIKE ?
                GROUP BY o.orders_id
                ORDER BY o.created_at DESC;`, ["ยกเลิก%"],
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

export const getOrdersById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, ocd.cost_package, o.created_at, o.updated_by,"+
                    " o.updated_at, o.status, o.statement_picture, o.post_code, cp.quantity as productCartQuantity, p.product_name, pp.productpic_name, "+
                    " cpd.cost_product, ocd.total_cost, op.profit, p.selling_price_per_quantity FROM orders o"+
                    " LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id"+
                    " LEFT JOIN order_profit op ON op.orders_id = o.orders_id"+
                    " LEFT JOIN cost_product_detaails cpd ON cpd.order_cost_details_id = ocd.order_cost_details_id"+
                    " INNER JOIN cart c ON o.cartId = c.cartId"+
                    " INNER JOIN cart_product cp ON c.cartId = cp.cartId"+
                    " INNER JOIN product p ON p.product_id = cp.product_id"+
                    " INNER JOIN productpicture pp ON pp.product_id = p.product_id"+
                    " WHERE o.orders_id = ? GROUP BY p.product_id",[id],
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

export const getStatusOrdersHistoryById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT o.orders_id, so.status_name, COALESCE(a.userName, c.username) AS username, osh.change_time, osh.note FROM  order_status_history osh"+ //COALESCE เลือกเอาอันที่ไม่เป็น Null
                    " INNER JOIN orders o ON osh.orders_id = o.orders_id"+
                    " INNER JOIN status_order so ON osh.status_order_id = so.status_order_id"+
                    " LEFT JOIN admin a ON a.admin_id = osh.changed_by"+
                    " LEFT JOIN customer c ON c.customer_id = osh.changed_by"+
                    " WHERE o.orders_id = ?"+
                    " ORDER BY osh.change_time DESC", [id],
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
