import sequelize from "sequelize" //Sequelize
import db from "../config/dataBase.js"
import customer from "./customer-model.js";

const {DataTypes} = sequelize

const order = db.define('product', {

    product_id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 1000]
        }
    }

},{
    freezeTableName: true
});

//Relation ระหว่าง table
customer.hasMany(order);
order.belongsTo(customer, {foreignKey: 'phone_number'});

export default order;