import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import { passToken } from "../../middleware/passAuth.js";

export const gusetGetProductCustomer = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query(`SELECT p.product_id, p.selling_price_per_quantity, p.quantity_per_time, p.product_name, pp.productpic_name FROM product p
                     INNER JOIN productpicture pp ON p.product_id = pp.product_id
                     WHERE p.is_active = ?`,["1"],
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

export const guestGetProductById = async (req, res) => {
    const id = req.params.id
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_name, p.selling_price_per_quantity, p.description, pp.productpic_name  FROM product p "+ 
                     "INNER JOIN productpicture pp ON pp.product_id = p.product_id WHERE p.product_id = ? ",
                     [id], 
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error });
    }
}