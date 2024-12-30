import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

export const getAmountOrders = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(`SELECT  DATE_FORMAT(o.created_at, '%Y-%m') AS sale_month,
                      COUNT(*) as countOrders FROM  orders o
                      LEFT JOIN status_order so ON so.status_order_id = o.status
                      WHERE DATE_FORMAT(o.created_at, '%m') = MONTH(NOW())
                      AND so.status_name NOT LIKE ? AND so.status_name NOT LIKE ?;`,['ยกเลิก%', 'รอ%'],
                (err, result) => {
                if (err) return reject(err)
                resolve(result)
                }
            ) 
        })
        // console.log(results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}

export const getSales = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => { //DATE_FORMAT(o.created_at, '%Y-%m') คำสั่ง Format วันเดือนปี
            db.query(`SELECT DATE_FORMAT(o.created_at, '%Y-%m') AS sale_month,
                    SUM(op.selling_price) AS total_sales,
                    SUM(op.selling_price - op.profit) as total_cost,
                    SUM(op.profit) as profit_month FROM orders o 
                    LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                    LEFT JOIN order_profit op ON op.orders_id = o.orders_id
                    LEFT JOIN status_order so ON so.status_order_id = o.status
                    WHERE so.status_name NOT LIKE ? AND so.status_name NOT LIKE ?
                    GROUP BY DATE_FORMAT(o.created_at, '%Y-%m') ORDER BY sale_month;`,['ยกเลิก%', 'รอ%'],
                (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        // console.log(results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}

export const getSalesRankPerMonth = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => { //DATE_FORMAT(o.created_at, '%Y-%m') คำสั่ง Format วันเดือนปี
            db.query(`WITH product_sales AS (
                        SELECT 
                            p.product_name,
                            SUM(cp.quantity) AS total_quantity
                        FROM orders o
                        LEFT JOIN cart c ON c.cartId = o.cartId
                        LEFT JOIN cart_product cp ON cp.cartId = c.cartId
                        LEFT JOIN product p ON p.product_id = cp.product_id
                        LEFT JOIN status_order so ON so.status_order_id = o.status
                        WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND so.status_name NOT LIKE "ยกเลิก%" AND so.status_name NOT LIKE "รอ%"
                        GROUP BY p.product_name
                    ),
                    ranked_sales AS (
                        SELECT 
                            product_name,
                            total_quantity,
                            RANK() OVER (ORDER BY total_quantity DESC) AS ranking
                        FROM product_sales
                    ),
                    top_5_sales AS (
                        SELECT 
                            product_name,
                            total_quantity
                        FROM ranked_sales
                        WHERE ranking <= 5
                    ),
                    others_sales AS (
                        SELECT 
                            'อื่นๆ' AS product_name,
                            SUM(total_quantity) AS total_quantity
                        FROM ranked_sales
                        WHERE ranking > 5
                    ),
                    final_sales AS (
                        SELECT * FROM top_5_sales
                        UNION ALL
                        SELECT * FROM others_sales
                    ),
                    total_sales AS (
                        SELECT SUM(total_quantity) AS total FROM final_sales
                    )
                    SELECT fs.product_name, fs.total_quantity, ROUND((fs.total_quantity / ts.total) * 100, 2) AS percentage
                    FROM final_sales fs
                    CROSS JOIN total_sales ts
                    ORDER BY percentage DESC;`, 
                (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        // console.log(results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}

export const getSalesPerMonth = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => { //DATE_FORMAT(o.created_at, '%Y-%m') คำสั่ง Format วันเดือนปี
            db.query(`SELECT DATE_FORMAT(o.created_at, '%Y-%m') AS sale_month,
                    SUM(o.total_price_product + ocd.cost_shipping + ocd.cost_package) AS total_sales,
                    SUM(ocd.total_cost + ocd.cost_shipping + ocd.cost_package) as total_cost,
                    SUM(op.profit) as profit_month FROM orders o 
                    LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                    LEFT JOIN order_profit op ON op.orders_id = o.orders_id
                    LEFT JOIN status_order so ON so.status_order_id = o.status
                    WHERE MONTH(o.created_at) = MONTH(NOW()) AND so.status_name NOT LIKE ? AND so.status_name NOT LIKE ?;`,['ยกเลิก%', 'รอ%'], 
                (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        // console.log(results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}

export const getNewCustomer = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(`SELECT DATE_FORMAT(c.created_at, '%Y-%m') AS month, 
                     COUNT(customer_id) AS total_new_customer
                     FROM customer c
                     WHERE MONTH(created_at) = MONTH(NOW());`,
                (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        // console.log(results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}

export const getGrowthUpSales = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(`WITH monthly_sales AS (
                    SELECT DATE_FORMAT(o.created_at, '%m') AS sale_month,
                    SUM(o.total_price_product + ocd.cost_shipping + ocd.cost_package) AS total_sales
                    FROM orders o 
                    LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                    LEFT JOIN status_order so ON so.status_order_id = o.status
                    WHERE MONTH(o.created_at) = MONTH(NOW()) AND so.status_name NOT LIKE "ยกเลิก%" AND so.status_name NOT LIKE "รอ%"
                    GROUP BY DATE_FORMAT(o.created_at, '%m') #//! ข้อมูลที่ได้จะเรียงจาก น้อยไปมาก 
                )
                SELECT ms1.sale_month, ms1.total_sales,
                ms2.total_sales AS previous_month_sales,
                ROUND(((ms1.total_sales - COALESCE(ms2.total_sales, 0)) / COALESCE(ms2.total_sales, 1)) * 100, 2) AS growth_percentage #//!COALESCE เพื่อจัดการกับค่า Null ให้เอาอีกค่ามาเเทน เเละ ROUND คือการปัดเศษทศนิยม
                FROM monthly_sales ms1 #//!CAST(... AS UNSIGNED) แปลง string เป็น ตัวเลข เอามาบวกกันเเพื่อไปเอาข้อมูลก่อนหน้าที่ได้จาก CTE เช่น ms1 = 10,11,12 เเต่ ms2 จะได้ 9,10,11 เพราะเป็นข้อมูลก่อนหน้าของ ms1 เเล้วเเปลงกลับมาเป็น CHAR 
                LEFT JOIN monthly_sales ms2 ON ms1.sale_month = LPAD(CAST(CAST(ms2.sale_month AS UNSIGNED) + 1 AS CHAR), 2, '0') #//!LPAD จะเติสข้อมูลทางซ้ายสุดตามตำเเหน่งที่เรากำหนดในที่นี้คือ 2 โดยเอา 0 ไปเติม
                ORDER BY ms1.sale_month DESC;`, 
                (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        // console.log(results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}
