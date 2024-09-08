import db from "../../config/dataBase.js"


export const getProduct = async (req, res) => {
    try {
        db.query(
            `SELECT * FROM products `, 
            (err, results) => {}
        )
    } catch (error) {
        
    }
}

export const getProductById = async (req, res) => {
    
}

export const createProduct = async (req, res) => {
    
}

export const updateProduct = async (req, res) => {
    
}

export const deleteProduct = async (req, res) => {
    
}