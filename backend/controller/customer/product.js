import db from "../../config/dataBase.js"

export const getProductCustomer = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_id, p.price, p.quantity, p.product_name, pp.productpic_name FROM product p"+
                    " INNER JOIN productpicture pp ON p.product_id = pp.product_id",
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        console.log("results",results);
        
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error: error.message });
    }
}

export const getProductById = async (req, res) => {
    const id = req.params.id
    console.log("get by id ",id);
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_id, p.product_name, p.quantity, p.price, p.description, p.create_by, p.update_by, p.create_at, p.updated_at, "+
                     "pp.productpic_name, pm.amount, m.material_id, m.material_name, m.cost_per_quantity, a.userName FROM product p "+
                     "INNER JOIN admin a ON a.admin_id = p.create_by "+ 
                     "INNER JOIN productpicture pp ON pp.product_id = p.product_id "+
                     "INNER JOIN product_material pm ON pm.product_id = p.product_id "+
                     "INNER JOIN material m ON m.material_id = pm.material_id WHERE p.product_id = ?",
                     [id], 
                    (err, result) => { 
                if (err) return reject(err)
                resolve(result)
            })
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error get product:", error);
        res.status(400).json({ message: "Error get product", error: error.message });
    }
}