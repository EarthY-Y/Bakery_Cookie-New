import Customer from "../models/customer-model.js" //ใช้สร้าง table เเละจัดการข้อมููลที่อยู่ใน database ด้วย lib sequelize
import argon2 from "argon2";

//ส่งออก Function getCustomer ด้วย export
export const getCustomer = async (req, res) => {
    try {
        //.findAll .fineOne .create เป็น menthod ของ Sequelize ใช้หาข้อมูลตาม attributes ที่กำหนด
        const response = await Customer.findAll({
            attributes:['phone_number','f_name','l_name','username', 'createdAt', 'updatedAt']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getCustomerById = async (req, res) => {
    console.log(req);
    console.log(res);
    try {
        const response = await Customer.findOne({
            attributes:['phone_number','f_name','l_name','username'],
            
            where: {
                phone_number: req.params.phone_number
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createCustomer = async (req, res) => {
    //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
    console.log(req.body);
    
    const {phone_number, username, password, confPassword, role_function, f_name, l_name} = req.body;
    
    if(password !== confPassword) return res.status(400).json({msg: "Password not match"});
    //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
    const hashPassword = await argon2.hash(password);
    try {
        await Customer.create({
            username: username,
            phone_number: phone_number,
            password: hashPassword,
            f_name: f_name,
            l_name: l_name,
            role_function: role_function,
        });
        res.status(201).json({msg: "Register complete"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateCustomer = (req, res) => {
    
}

export const deleteCustomer = (req, res) => {
    
}

