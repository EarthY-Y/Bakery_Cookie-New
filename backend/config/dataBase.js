import sequelize from "sequelize" //Sequelize

const db = new sequelize('myproject',/*ชื่อ database*/ 
    'root' /* user */ , 
    '', /* password */ 
    {
    host: 'localhost',
    dialect: "mysql"
})

//set ค่าให้เป็นค่าเริ่มต้นของ Module นี้ซึ่งมีได้เเค่ค่าเดียว เเต่ถ้าต้องการส่งออกหลายค่าให้เอาออก
export default db