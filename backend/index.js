//import,require ตัว packet ที่เราต้องการใช้เข้ามา
import express from'express';
import mysql from 'mysql';
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import customerRoute from "./routes/customer/customer-Route.js";
import orderRounte from "./routes/customer/order-Route.js";
import authRoute from "./routes/auth-Route.js"
import db from "./config/dataBase.js";


dotenv.config();
//เรียกใช้ express ด้วย app
const app = express();


app.use(express.json()); //convert object to json object


// คำสั่งสร้าง dataTable
// (async () => {
//   await db.sync();
// })();

//setting packet ต่างๆที่เรานำเข้ามาใช้ให้กับ express
app.use(session ({
  // secret: 'secret',
  secret: process.env.SEESION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    //http : false or https : true
    secure: 'auto',
  }
}))

app.use(cors({
  credential: true,
  origin: ["http://localhost:3000"],
}));

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running `);
})

//เอาไว้ข้างล่างเพราะว่า ต้อง set ค่าต่างๆจากด้านบนก่อนอย่างเช่น session ที่ set ด้านบน ที่มีอยู่ใน authRoute 
app.use(customerRoute);
app.use(orderRounte);
app.use(authRoute);