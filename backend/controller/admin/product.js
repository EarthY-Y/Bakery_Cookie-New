import db from "../../config/dataBase.js"


export const getProduct = (req, res) => {
    try {
        db.query(
            `SELECT * FROM products `, 
            (err, results) => {}
        )
    } catch (error) {
        
    }
}

export const getProductById = (req, res) => {
    
}

export const createProduct = (req, res) => {
    
}

export const updateProduct = (req, res) => {
    
}

export const deleteProduct = (req, res) => {
    
}