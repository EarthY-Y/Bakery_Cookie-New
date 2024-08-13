import Customer from "../models/customer-model.js"
import argon2 from "argon2";

export const getCustomer = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes:['phone_number','f_name','l_name','username']
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
        const response = await User.findOne({
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
    const {phone_number, username, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    //เข้ารหัส password กันโดนโจมตีระหว่างทาง
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            username: username,
            phone_number: phone_number,
            password: hashPassword,
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateCustomer = (req, res) => {
    
}

export const deleteCustomer = (req, res) => {
    
}

