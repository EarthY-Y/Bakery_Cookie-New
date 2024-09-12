import mysql from "mysql"

//กำหนด MySql Connection 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', //ถ้าเป็น xampp ไม่ต้องใส่
    database: 'bakery_cookie_new',
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