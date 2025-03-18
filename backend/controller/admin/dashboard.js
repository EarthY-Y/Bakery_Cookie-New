import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

export const getAmountOrders = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(`SELECT  DATE_FORMAT(o.created_at, '%Y-%m') AS sale_month,
                      COUNT(*) as countOrders FROM  orders o
                      LEFT JOIN status_order so ON so.status_order_id = o.status
                      WHERE MONTH(o.created_at) = MONTH(NOW()) AND YEAR(o.created_at) = YEAR(NOW())
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
                    WHERE MONTH(o.created_at) = MONTH(NOW()) AND YEAR(o.created_at) = YEAR(NOW()) AND so.status_name NOT LIKE ? AND so.status_name NOT LIKE ?;`,['ยกเลิก%', 'รอ%'], 
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
                        SELECT 
                            DATE_FORMAT(o.created_at, '%Y-%m') AS sale_month,
                            SUM(o.total_price_product + ocd.cost_shipping + ocd.cost_package) AS total_sales
                        FROM orders o
                        LEFT JOIN order_cost_details ocd ON ocd.orders_id = o.orders_id
                        LEFT JOIN status_order so ON so.status_order_id = o.status
                        WHERE so.status_name NOT LIKE 'ยกเลิก%' 
                        AND so.status_name NOT LIKE 'รอ%' 
                        AND o.created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 YEAR), '%Y-01-01') # INTERVAL กำหนดระยะเวลาที่ต้องการ DATE_SUB คำสั่งลบระยะเวลา เพื่อเอาข้อมูลย้อนหลัง 1 ปี
                        GROUP BY sale_month
                    ),
                    comparison_data AS (
                        SELECT 
                            ms1.sale_month, 
                            ms1.total_sales, 
                            LAG(ms1.total_sales, 1) OVER (ORDER BY ms1.sale_month) AS previous_month_sales, # LAG คำสั่งใช้ในการดึงข้อมูลก่อนหน้ามาใช้
                                ROUND(((ms1.total_sales - LAG(ms1.total_sales, 1) OVER (ORDER BY ms1.sale_month)) /  #OVER ใช้ในการเรียงลำดับข้อมูลเพื่อให้ LAG ดึงข้อมูลก่อนหน้ามาใช้ได้
                                    NULLIF(LAG(ms1.total_sales, 1) OVER (ORDER BY ms1.sale_month), 0)) * 100, 2) 
                             AS growth_percentage
                        FROM monthly_sales ms1
                    )
                    SELECT * FROM comparison_data ORDER BY sale_month DESC;`, 
                (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        console.log(results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}
