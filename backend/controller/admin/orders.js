import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const getOrderslistWaitStatement = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product + ocd.cost_shipping + ocd.cost_package as price, 
                     op.profit, so.status_name, o.created_at, osh.change_time as updated_at, c.username FROM orders o
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     LEFT JOIN order_profit op ON op.orders_id = o.orders_id
                     INNER JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                     LEFT JOIN customer c ON c.customer_id = o.customer_id
                     WHERE so.status_name LIKE ?
                     GROUP BY o.orders_id;`, ["รอ%"],
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
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, 
                     ocd.cost_package, so.status_name, o.created_at, osh.change_time as updated_at,
                     c.username FROM orders o 
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     INNER JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                     LEFT JOIN customer c ON c.customer_id = o.customer_id
                     WHERE so.status_name NOT LIKE ? AND so.status_name NOT LIKE ? AND so.status_name NOT LIKE ?
                     GROUP BY o.orders_id;`, ["รอ%", "ยกเลิก%", "%สำเร็จ"],
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

export const getOrdersById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, ocd.cost_package, o.created_at, o.updated_by,"+
                    " o.updated_at, o.status, o.statement_picture, cp.quantity as productCartQuantity, p.product_name, pp.productpic_name, "+
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
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}

export const getOrdersHistoryById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT o.orders_id, so.status_name, COALESCE(a.userName, c.username) AS username, osh.change_time FROM  order_status_history osh"+ //COALESCE เลือกเอาอันที่ไม่เป็น Null
                    " INNER JOIN orders o ON osh.orders_id = o.orders_id"+
                    " INNER JOIN status_order so ON osh.status_order_id = so.status_order_id"+
                    " LEFT JOIN Admin a ON a.admin_id = osh.changed_by"+
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
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}
// export const updateStatusOrder = async (req, res) => {
//     try {
//         const authHeader = req.headers['authorization'];
//         const token = await passToken(authHeader);
//         const id = req.params.id
//         const {status} = req.body
//         const results = await new Promise((resolve, reject)=> {
//             db.query("UPDATE orders SET status = ?, updated_by = ? WHERE orders_id = ?", [status, token.admin_id, id],
//                     (err, result) => { 
//                 if (err) return reject(err)
//                 resolve(result)
//             })
//         })
//         const resultsInsertHistory = await new Promise((resolve, reject)=> {
//             db.query("INSERT INTO order_status_history (history_id , orders_id, status_order_id, changed_by) VALUES (?, ?, ?, ?)",[uuidv4(), id, status, authToken.admin_id],
//                     (err, result) => { 
//                 if (err) return reject(err)
//                 resolve(result)
//             })
//         })
//         console.log("results",results);
//         return res.status(200).json(results);
//     } catch (error) {
//         console.error("Error get product:", error);
//         res.status(400).json({ message: "Error get product", error });
//     }
// }