import mysql from "mysql"
import dotenv from "dotenv";

dotenv.config();
//กำหนด MySql Connection 
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: '', //ถ้าเป็น xampp ไม่ต้องใส่ process.env.passwordDatabase
    database: process.env.DATABASE_NAME,
    // pool: {
    //     max: 5,
    //     min: 0,
    //     acquire:30000,
    //     idle: 10000
    // }
})

db.connect((err) => {
    if(err){
        console.log(err) //ถ้า error อาจจะต้องกำหนดหรือดู port ของ xmapp ด้วย
        return;
    }
    console.log('mysql successfully connect')
})

//set ค่าให้เป็นค่าเริ่มต้นของ Module นี้ซึ่งมีได้เเค่ค่าเดียว เเต่ถ้าต้องการส่งออกหลายค่าให้เอาออก
export default db