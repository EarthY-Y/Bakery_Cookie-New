import db from "../../config/dataBase.js"
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2";

//ส่งออก Function getAdmin ด้วย export
export const getAdmin = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT f_name,l_name,userName FROM admin", (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        
        console.log(results)
        return res.status(200).json(results);

    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}

export const getAdminById = async (req, res) => {
    try {
        const UserName = req.params.userName
        console.log(UserName);
        
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT userName FROM Admin WHERE userName = ?", [UserName], (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
        
        console.log(results)
        return res.status(200).json(results);
            
    } catch (error) {
        console.error("Error get admin by id", error);
        res.status(400).json({ message: "Error get admin by id", error});
    }
}

export const createAdmin = async (req, res) => {
    try {
        //gen id ให้ไม่ซ้ำกัน
        const id = uuidv4();
        //เวลา cilent ส่งอะไรมาจะถูกเก็บไว้ใน req.body
        const {userName, passWord, f_name, l_name, confPassword} = req.body;
        
        if(passWord !== confPassword) return res.status(400).json({message: "Password not match"});
        //เข้ารหัส password กันโดนโจมตีด้วย lib argon2
        const hashPassword = await argon2.hash(passWord); //function hash(password, options) option เช่น ขนาด รูปเบบ เเละการกินพื้นที่ ต่างๆ
        const results = await new Promise((resolve, reject)=> {
            db.query("INSERT INTO admin (admin_id, userName, password, f_name, l_name,  is_active) VALUES(?, ?, ?, ?, ?, ?)",
                    [id, userName, hashPassword, f_name, l_name, 'Y'], 
                    (err, result) =>{
                        if(err) return reject(err);
                        resolve({message: "Register complete", result});
                    }
            )
        })
                
        return res.status(201).json(results.message); 
            
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(400).json({ message: "Error creating admin", error });
    }
}

export const updateAdmin = (req, res) => {
    
}

export const deleteAdmin = (req, res) => {
    
}

export const roleAdmin = (req, res) => {
    
}

export const createDataTable = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(`CREATE TABLE customer (
                    customer_id VARCHAR(40) PRIMARY KEY,
                    phone_number VARCHAR(50) UNIQUE,
                    f_name VARCHAR(100),
                    l_name VARCHAR(100),
                    username VARCHAR(50) UNIQUE,
                    password VARCHAR(256),
                    customerpic VARCHAR(50),
                    status VARCHAR(50),
                    created_at DATETIME,
                    updated_at DATETIME,
                    is_active TINYINT(1)
                    );

                    CREATE TABLE roleCustomer (
                    role_id VARCHAR(40) PRIMARY KEY,
                    role_name VARCHAR(50)
                    );

                    CREATE TABLE customer_role (
                    customer_role_id VARCHAR(40) PRIMARY KEY,
                    customer_id VARCHAR(40),
                    role_id VARCHAR(40),
                    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
                    FOREIGN KEY (role_id) REFERENCES roleCustomer(role_id)
                    );

                    CREATE TABLE admin (
                    admin_id VARCHAR(40) PRIMARY KEY,
                    userName VARCHAR(50) UNIQUE,
                    f_name VARCHAR(100),
                    l_name VARCHAR(100),
                    adminpic VARCHAR(50),
                    passWord VARCHAR(256),
                    is_active TINYINT(1)
                    );

                    CREATE TABLE roleAdmin (
                    roleAdmin_id VARCHAR(40) PRIMARY KEY,
                    roleName VARCHAR(50)
                    );

                    CREATE TABLE admin_role (
                    admin_role_id VARCHAR(40) PRIMARY KEY,
                    admin_id VARCHAR(40),
                    roleAdmin_id VARCHAR(40),
                    FOREIGN KEY (admin_id) REFERENCES admin(admin_id),
                    FOREIGN KEY (roleAdmin_id) REFERENCES roleAdmin(roleAdmin_id)
                    );

                    CREATE TABLE province (
                    province_id VARCHAR(40) PRIMARY KEY,
                    province_nameTH VARCHAR(50),
                    province_nameEN VARCHAR(50)
                    );

                    CREATE TABLE amphure (
                    amphure_id VARCHAR(40) PRIMARY KEY,
                    province_id VARCHAR(40),
                    amphure_nameTH VARCHAR(50),
                    amphure_nameEN VARCHAR(50),
                    FOREIGN KEY (province_id) REFERENCES province(province_id)
                    );

                    CREATE TABLE tambon (
                    tambon_id VARCHAR(40) PRIMARY KEY,
                    amphure_id VARCHAR(40),
                    tambon_nameTH VARCHAR(50),
                    tambon_nameEN VARCHAR(50),
                    zip_code VARCHAR(50),
                    FOREIGN KEY (amphure_id) REFERENCES amphure(amphure_id)
                    );

                    CREATE TABLE address (
                    addressId VARCHAR(40) PRIMARY KEY,
                    houseNo VARCHAR(50),
                    province_id VARCHAR(40),
                    amphure_id VARCHAR(40),
                    tambon_id VARCHAR(40),
                    zip_code VARCHAR(50),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (province_id) REFERENCES province(province_id),
                    FOREIGN KEY (amphure_id) REFERENCES amphure(amphure_id),
                    FOREIGN KEY (tambon_id) REFERENCES tambon(tambon_id)
                    );

                    CREATE TABLE cart (
                    cartId VARCHAR(40) PRIMARY KEY,
                    customer_id VARCHAR(40),
                    status VARCHAR(50),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
                    );

                    CREATE TABLE orders (
                    orders_id VARCHAR(40) PRIMARY KEY,
                    customer_id VARCHAR(40),
                    cartId VARCHAR(40),
                    quantity INT NOT NULL,
                    price DECIMAL(10, 2),
                    statement_picture VARCHAR(50),
                    status VARCHAR(50),
                    shipping_rate_id VARCHAR(40),
                    post_code VARCHAR(50),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
                    FOREIGN KEY (cartId) REFERENCES cart(cartId)
                    );

                    CREATE TABLE orders_address (
                    orders_address_id VARCHAR(40) PRIMARY KEY,
                    orders_id VARCHAR(40),
                    houseNo VARCHAR(50),
                    province_id VARCHAR(40),
                    amphure_id VARCHAR(40),
                    tambon_id VARCHAR(40),
                    zip_code VARCHAR(50),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (orders_id) REFERENCES orders(orders_id),
                    FOREIGN KEY (province_id) REFERENCES province(province_id),
                    FOREIGN KEY (amphure_id) REFERENCES amphure(amphure_id),
                    FOREIGN KEY (tambon_id) REFERENCES tambon(tambon_id)
                    );

                    CREATE TABLE order_cost_details (
                    order_cost_details_id VARCHAR(40) PRIMARY KEY,
                    orders_id VARCHAR(40),
                    cost_shipping DECIMAL(10, 2),
                    cost_package DECIMAL(10, 2),
                    total_cost DECIMAL(10, 2),
                    created_at DATETIME,
                    FOREIGN KEY (orders_id) REFERENCES orders(orders_id)
                    );

                    CREATE TABLE product (
                    product_id VARCHAR(40) PRIMARY KEY,
                    product_name VARCHAR(50) NOT NULL,
                    quantity_per_time INT NOT NULL,
                    selling_price_per_quantity DECIMAL(10, 2) NOT NULL,
                    status VARCHAR(50),
                    description TEXT,
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (created_by) REFERENCES admin(admin_id),
                    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
                    );

                    CREATE TABLE cost_product_details (
                    cost_product_details_id VARCHAR(40) PRIMARY KEY,
                    order_cost_details_id VARCHAR(40),
                    product_id VARCHAR(40),
                    cost_product DECIMAL(10, 2),
                    quantity DECIMAL(10, 2),
                    total_product_cost DECIMAL(10, 2),
                    created_at DATETIME,
                    FOREIGN KEY (order_cost_details_id) REFERENCES order_cost_details(order_cost_details_id),
                    FOREIGN KEY (product_id) REFERENCES product(product_id)
                    );

                    CREATE TABLE order_profit (
                    order_profit_id VARCHAR(40) PRIMARY KEY,
                    orders_id VARCHAR(40),
                    selling_price DECIMAL(10, 2),
                    profit DECIMAL(10, 2),
                    created_at DATETIME,
                    FOREIGN KEY (orders_id) REFERENCES orders(orders_id)
                    );

                    CREATE TABLE status_order (
                    status_order_id VARCHAR(40) PRIMARY KEY,
                    status_name VARCHAR(50),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME
                    );

                    CREATE TABLE order_status_history (
                    history_id VARCHAR(40) PRIMARY KEY,
                    orders_id VARCHAR(40),
                    status_order_id VARCHAR(40),
                    changed_by VARCHAR(40),
                    change_time DATETIME,
                    note_text VARCHAR(50),
                    FOREIGN KEY (orders_id) REFERENCES orders(orders_id),
                    FOREIGN KEY (status_order_id) REFERENCES status_order(status_order_id)
                    );

                    CREATE TABLE status_cart (
                    status_cart_id VARCHAR(40) PRIMARY KEY,
                    status_name VARCHAR(50),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME
                    );

                    CREATE TABLE product_category (
                    category_id VARCHAR(40) PRIMARY KEY,
                    category_name VARCHAR(50),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME
                    );

                    CREATE TABLE category_product (
                    category_product_id VARCHAR(40) PRIMARY KEY,
                    product_id VARCHAR(40),
                    category_id VARCHAR(40),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (product_id) REFERENCES product(product_id),
                    FOREIGN KEY (category_id) REFERENCES product_category(category_id)
                    );

                    CREATE TABLE productpicture (
                    productpic_id VARCHAR(40) PRIMARY KEY,
                    product_id VARCHAR(40),
                    productpic_name VARCHAR(50),
                    productpic_type VARCHAR(50),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (product_id) REFERENCES product(product_id)
                    );

                    CREATE TABLE material (
                    material_id VARCHAR(40) PRIMARY KEY,
                    material_name VARCHAR(50),
                    quantity INT,
                    cost FLOAT,
                    cost_per_quantity FLOAT,
                    total_quantity FLOAT,
                    materialpic_name VARCHAR(50),
                    materialpic_type VARCHAR(50),
                    status VARCHAR(50),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (created_by) REFERENCES admin(admin_id),
                    FOREIGN KEY (updated_by) REFERENCES admin(admin_id)
                    );

                    CREATE TABLE product_material (
                    product_materialId VARCHAR(40) PRIMARY KEY,
                    product_id VARCHAR(40),
                    material_id VARCHAR(40),
                    quantity VARCHAR(50),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (product_id) REFERENCES product(product_id),
                    FOREIGN KEY (material_id) REFERENCES material(material_id)
                    );

                    CREATE TABLE cart_product (
                    cart_product_id VARCHAR(40) PRIMARY KEY,
                    product_id VARCHAR(40),
                    cartId VARCHAR(40),
                    quantity INT NOT NULL,
                    price DECIMAL(10, 2),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (product_id) REFERENCES product(product_id),
                    FOREIGN KEY (cartId) REFERENCES cart(cartId)
                    );

                    CREATE TABLE package (
                    package_id VARCHAR(40) PRIMARY KEY,
                    package_name VARCHAR(50) NOT NULL
                    );

                    CREATE TABLE package_product (
                    package_product_id VARCHAR(40) PRIMARY KEY,
                    product_id VARCHAR(40),
                    package_id VARCHAR(40),
                    created_by VARCHAR(40),
                    updated_by VARCHAR(40),
                    created_at DATETIME,
                    updated_at DATETIME,
                    FOREIGN KEY (product_id)
                `, (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }) 
        })
        
        console.log(results)
        return res.status(200).json(results);

    } catch (error) {
        console.error("Error get admin:", error);
        res.status(400).json({ message: "Error get admin", error });
    }
}