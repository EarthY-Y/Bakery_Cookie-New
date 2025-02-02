import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const getOrderslistWaitStatement = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product + COALESCE(ocd.cost_shipping, 0) + COALESCE(ocd.cost_package, 0)as price, 
                     op.profit, so.status_name, o.created_at, osh.change_time as updated_at, CONCAT(f_name, ' ', l_name)  as fullname FROM orders o
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     LEFT JOIN order_profit op ON op.orders_id = o.orders_id
                     INNER JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                     LEFT JOIN customer c ON c.customer_id = o.customer_id
                     WHERE so.status_name LIKE ?
                     GROUP BY o.orders_id
                     ORDER BY o.created_at DESC;`, ["รอ%"],
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
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, 
                     ocd.cost_package, so.status_name, o.created_at, osh.change_time as updated_at,
                     CONCAT(f_name, ' ', l_name)  as fullname FROM orders o 
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     INNER JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_status_history osh ON osh.orders_id = o.orders_id
                     LEFT JOIN customer c ON c.customer_id = o.customer_id
                     WHERE so.status_name NOT LIKE ? AND so.status_name NOT LIKE ? AND so.status_name NOT LIKE ?
                     GROUP BY o.orders_id
                     ORDER BY o.created_at DESC;`, ["รอ%", "ยกเลิก%", "%สำเร็จ"],
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
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, 
                     ocd.cost_package, so.status_name, o.created_at, osh.change_time as updated_at,
                     CONCAT(f_name, ' ', l_name)  as fullname FROM orders o 
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

export const getStatusOrderslist = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT so.status_name, COUNT(o.orders_id) as countOrders
                     FROM status_order so
                     LEFT JOIN orders o ON o.status = so.status_order_id
                     WHERE is_active = 1
                     GROUP BY so.status_name;`,
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

export const getStatusListForChangeOrders = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT so.status_order_id, so.status_name, cso.category_status_order_name FROM status_order so 
                     LEFT JOIN category_status_order cso ON cso.category_status_order_id = so.category_status_order_id
                     WHERE so.is_active = 1 AND cso.category_status_order_name LIKE ? OR cso.category_status_order_name LIKE ?`, ["กำลัง%","รอ%"],
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
            db.query(`SELECT o.orders_id, o.quantity, o.total_price_product as price, ocd.cost_shipping, ocd.cost_package, o.created_at, o.updated_by,
                     o.updated_at, o.status, o.statement_picture, o.post_code, so.status_name, cp.quantity as productCartQuantity, 
                     p.product_name, pp.productpic_name, cpd.cost_product, ocd.total_cost, op.profit, p.selling_price_per_quantity FROM orders o
                     LEFT JOIN status_order so ON so.status_order_id = o.status
                     LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                     LEFT JOIN order_profit op ON op.orders_id = o.orders_id
                     LEFT JOIN cost_product_detaails cpd ON cpd.order_cost_details_id = ocd.order_cost_details_id
                     INNER JOIN cart c ON o.cartId = c.cartId
                     INNER JOIN cart_product cp ON c.cartId = cp.cartId
                     INNER JOIN product p ON p.product_id = cp.product_id
                     INNER JOIN productpicture pp ON pp.product_id = p.product_id
                     WHERE o.orders_id = ? GROUP BY p.product_id`,[id],
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

export const getOrdersHistoryById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT o.orders_id, so.status_name, COALESCE(a.userName, c.username) AS username, osh.change_time FROM  order_status_history osh"+ //COALESCE เลือกเอาอันที่ไม่เป็น Null
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

export const getOrdersAddressById = async (req, res) => {
    try {
        const id = req.params.id
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT ra.tambon_name, ra.amphure_name, ra.province_name, ra.zip_code, ra.house_no,
                     ra.zip_code, c.username, c.f_name, c.l_name, c.phone_number FROM order_address ra
                     LEFT JOIN orders o ON o.orders_id = ra.orders_id
                     LEFT JOIN customer c ON c.customer_id = o.customer_id 
                     WHERE ra.orders_id = ?`, [id],
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

export const updateStatusOrder = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = await passToken(authHeader);
        const id = req.params.id
        const {status, skip} = req.body
        if(!skip){ //ถ้าหน้าส่ง skip มาก็จะไม่ตรวจสอบ duplicate
            const resultsDupilcateHistory = await new Promise((resolve, reject)=> {
                db.query("SELECT history_id FROM order_status_history WHERE orders_id = ? AND status_order_id = ? AND changed_by = ?",[id, status, token.admin_id],
                        (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                })
            })
            console.log(resultsDupilcateHistory);
            
            if(resultsDupilcateHistory[0]?.history_id){
                return res.status(400).json({ message: "เคยใช้สถานะนี้เเล้ว"})
            }
        }
        const results = await new Promise((resolve, reject)=> {
            db.query("UPDATE orders SET status = ?, updated_by = ? WHERE orders_id = ?", [status, token.admin_id, id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        const resultsInsertHistory = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO order_status_history (history_id , orders_id, status_order_id, changed_by) VALUES (?, ?, ?, ?)",[uuidv4(), id, status, token.admin_id],
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

export const updatePostCodeOrder = async (req, res) => {
    try {
        const id = req.params.id
        const postCode = req.body.postCode
        await updatePostCodeHistoryStatusOrder(req, res)
        const results = await new Promise((resolve, reject)=> {
            db.query(`UPDATE orders SET post_code = ? WHERE orders_id = ?`, [postCode, id],
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

export const updatePostCodeHistoryStatusOrder = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const  authToken = await passToken(authHeader);
        const id = req.params.id

        console.log("updatePostCodeHistoryStatusOrder: " , id);
        const { postCode } = req.body
        const results = await new Promise((resolve, reject)=> {
            db.query(`WITH check_postCode AS (
                        SELECT 1 AS exists_flag
                        FROM orders
                        WHERE orders_id = ? AND post_code IS NULL
                    )
                    SELECT status_order_id FROM status_order
                    WHERE 
                        (EXISTS (SELECT 1 FROM check_postCode) AND status_name LIKE 'เพิ่มรหัส%') #EXISTS ถ้ามีข้อมูลอยู่จะเป็น True
                        OR 
                        (NOT EXISTS (SELECT 1 FROM check_postCode) AND status_name LIKE 'แก้ไขรหัส%');`, [id],
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        if(results[0]?.status_order_id !== undefined){
            let statusId = results[0]?.status_order_id
            console.log(results);
            console.log("statusId: ",statusId);
            
            const resultsInsertHistory = await new Promise((resolve, reject)=> {
                db.query("INSERT INTO order_status_history (history_id , orders_id, status_order_id, changed_by, note) VALUES (?, ?, ?, ?, ?)",[uuidv4(), id, statusId, authToken.admin_id, postCode],
                        (err, result) => { 
                    if (err) return reject(err)
                    resolve(result)
                })
            })
        }
    } catch (error) {
        console.error("มีบางอย่างผิดพลาด กรุณาเเจ้งฝ่ายดูเเล:", error);
        throw error
    }
}