import db from "../config/dataBase.js"
import argon2 from "argon2";


db.connect((err) => {
    if(err){
        console.log(err) //ถ้า error อาจจะต้องกำหนดหรือดู port ของ xmapp ด้วย
        return;
    }
    console.log('mysql successfully connect')
})

//ส่งออก Function getCustomer ด้วย export
export const getCustomer = async (req, res) => {
    try {
        db.query(
            //สร้าง Query มาทำงาน 
            "SELECT * FROM customer", 
            //results คือค่าที่เราจะได้จากการไป get มา
            (errr, results, fields) => {
                if(errr){
                    console.log(errr)
                    return res.status(400),send();
                }
                console.log(results)
                res.status(200).json(results);
            }
        )
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getCustomerById = async (req, res) => {
    // console.log(req);
    // console.log(res);
    // try {
    //     const response = await Customer.findOne({
    //         attributes:['phone_number','f_name','l_name','username'],
            
    //         where: {
    //             phone_number: req.params.phone_number
    //         }
    //     });
    //     res.status(200).json(response);
    // } catch (error) {
    //     res.status(500).json({msg: error.message});
    // }
}

export const createCustomer = async (req, res) => {
    //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
    // console.log(req.body);
    
    // const {phone_number, username, password, confPassword, role_function, f_name, l_name} = req.body;
    
    // if(password !== confPassword) return res.status(400).json({msg: "Password not match"});
    // //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
    // const hashPassword = await argon2.hash(password);
    // try {
    //     await Customer.create({
    //         username: username,
    //         phone_number: phone_number,
    //         password: hashPassword,
    //         f_name: f_name,
    //         l_name: l_name,
    //         role_function: role_function,
    //     });
    //     res.status(201).json({msg: "Register complete"});
    // } catch (error) {
    //     res.status(400).json({msg: error.message});
    // }
}

export const updateCustomer = (req, res) => {
    
}

export const deleteCustomer = (req, res) => {
    
}

