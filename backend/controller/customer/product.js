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
    try {
        const results = await new Promise((resolve, reject)=> {
            db.query("SELECT p.product_name, p.price, p.description, p.quantity, pp.productpic_name  FROM product p "+ 
                     "INNER JOIN productpicture pp ON pp.product_id = p.product_id",
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