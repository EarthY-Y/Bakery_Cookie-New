import sequelize from "sequelize" //Sequelize
import db from "../config/dataBase.js"

//โมเดลมีไว้เพื่อสร้าง DataTable มั้ง
const {DataTypes} = sequelize

const Users = db.define('customer', {
    phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 1000]
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 1000]
        }
    },
    f_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 1000]
        }
    },
    l_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 1000]
        }
    },

    role_function: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 1000]
        }
    },

},{
    freezeTableName: true
});

export default Users;