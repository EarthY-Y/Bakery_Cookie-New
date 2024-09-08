import db from "../../config/dataBase.js"


export const getMaterial = async (req, res) => {
    try {
        db.query(
            `SELECT * FROM material `, 
            (err, results) => {}
        )
    } catch (error) {
        
    }
}

export const getMaterialById = async (req, res) => {
    const id = uuidv4();
    //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
    const {material_name, quantity, cost} = req.body;
    try {
        db.query(
        "INSERT INTO material (material_id, material_name, quantity, cost, created_at, admin_id) VALUES(?, ?, ?, ?, ? )",
        [id , material_name	, quantity, cost, "","admin"],
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400),send();
                }
        res.status(201).json({msg: "Add complete"}); 
    }
    )
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const createMaterial = async (req, res) => {
    
}

export const updateMaterial = async (req, res) => {
    
}

export const deleteMaterial = async (req, res) => {
    
}