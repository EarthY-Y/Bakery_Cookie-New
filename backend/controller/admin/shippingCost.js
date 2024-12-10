import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";
import { passToken } from "../../middleware/passAuth.js";

export const getShipping = async (req, res) => {
    try {
        // console.log('getShipping');

        const results = await new Promise((resolve, reject) => {
            db.query(`SELECT sr.shipping_rate_id, sr.carrier_name, sr.service_type,
                     sr.weight_range_min, sr.weight_range_max, sr.price, sr.estimated_delivery_days,
                     sr.is_active, p.cost_per_quantity FROM shipping_rate sr
                     LEFT JOIN package p ON p.package_id = sr.package_id`,
                (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                }
            )
        })
        // console.log('results material ', results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get material", error);
        return res.status(400).json({ message: "Error get material", error });
    }
}

export const getShippingById = async (req, res) => {
    const id = req.params.id
    // console.log(id);
    try {
        const result = await new Promise((resolve, reject) => {
            db.query("SELECT sr.*, p.package_name, p.package_name FROM shipping_rate sr" +
                " INNER JOIN package p ON sr.package_id = p.package_id " +
                " WHERE sr.shipping_rate_id = ?", [id],
                (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                }
            )
        })
        return res.status(200).json(result)
    } catch (error) {
        console.error("Error get shippingById", error);
        return res.status(400).json({ message: "Error get material", error });
    }
}
export const getShippingPackage = async (req, res) => {
    try {
        // console.log('getShippingPackage');

        const results = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM package WHERE package_name LIKE ? ", ["กล่อง%"],
                (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                }
            )
        })
        // console.log('results material ', results)
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get material", error);
        return res.status(400).json({ message: "Error get material", error });
    }
}
export const createShipping = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']

        const token = await passToken(authHeader)
        const id = uuidv4();
        const { carrierName, serviceType, weightRangeMin, weightRangeMax, price, deliveryDays, packageId } = req.body;
        const results = await new Promise((resolve, reject) => {
            db.query("INSERT INTO shipping_rate (shipping_rate_id, carrier_name, service_type, weight_range_min, weight_range_max," +
                " price, package_id, estimated_delivery_days, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [id, carrierName, serviceType, weightRangeMin, weightRangeMax, price, packageId, deliveryDays, token.admin_id],
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
        return res.status(200).json({ message: "Shipping created successfully", results });
    } catch (error) {
        console.error("Error creating material:", error);
        return res.status(400).json({ message: "Error creating material", error });
    }
}

export const updateShipping = async (req, res) => {
    try {
        const { id } = req.params; // รับ material_id จาก URL
        const { carrierName, serviceType, weightRangeMin, weightRangeMax, price, deliveryDays, packageId, active } = req.body; // รับข้อมูลฟิลด์ที่ต้องการอัปเดต

        // Dynamic SQL - สร้าง Query เฉพาะฟิลด์ที่มีการเปลี่ยนแปลง
        let query = 'UPDATE shipping_rate SET ';
        const fields = [];
        const values = [];
        let is_active = false

        if (carrierName) {
            fields.push('carrier_name = ?');
            values.push(carrierName);
        }
        if (serviceType) {
            fields.push('service_type = ?');
            values.push(serviceType);
        }
        if (weightRangeMin) {
            fields.push('	weight_range_min = ?');
            values.push(weightRangeMin);
        }
        if (weightRangeMax) {
            fields.push('weight_range_max = ?');
            values.push(weightRangeMax);
        }
        if (price) {
            fields.push('price = ?');
            values.push(price);
        }
        if (deliveryDays) {
            fields.push('estimated_delivery_days = ?');
            values.push(deliveryDays);
        }
        if (packageId) {
            fields.push('package_id = ?');
            values.push(packageId);
        }
        if (active == "1") {
            is_active = true
            fields.push('is_active = ?');
            values.push(is_active);
        } else {
            fields.push('is_active = ?');
            values.push(is_active);
        }

        const authHeader = req.headers['authorization']
        const token = await passToken(authHeader)
        if (token) {
            fields.push('updated_by = ?');
            values.push(token.admin_id);
        } else {
            throw new Error("ไม่มี token")
        }
        query += fields.join(', ');
        query += ' WHERE shipping_rate_id  = ?';
        values.push(id);

        // Debug Query
        console.log('Generated Query:', query);

        // เรียกใช้ Query กับฐานข้อมูล
        const results = await new Promise((resolve, reject) => {
            db.query(query, values,
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
        })

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Shipping not found' });
        }

        res.status(200).json({ message: 'Shipping updated successfully' });
    } catch (error) {
        console.error("Error get customer by id:", error);
        return res.status(400).json({ message: "Error get province", error });
    }
};


export const deleteShipping = async (req, res) => {
    // const id = req.params.id
    // console.log("delete by id ", id);

    // try {
    //     const result = await new Promise((resolve, reject) => {
    //         db.query("DELETE FROM shipping_rate WHERE shipping_rate_id = ?", [id],
    //             (err, result) => {
    //                 if (err) return reject(err)
    //                 resolve(result)
    //             })
    //     })
    //     return res.status(200).json(result)
    // } catch (error) {

    // }
}