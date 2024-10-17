//import,require ตัว packet ที่เราต้องการใช้เข้ามา
import express from'express';
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import customerRoute from "./routes/customer/customer-Route.js";
import orderRounte from "./routes/customer/order-Route.js";
import materialRounte from "./routes/admin/material-Route.js";
import adminRoute from "./routes/admin/admin-Route.js";
import authRoute from "./routes/auth-Route.js"
import cookieParser from 'cookie-parser'


//เรียกใช้ express ด้วย app
const app = express();
// app.use(express.json()); 
dotenv.config();

app.use(express.json({ //convert object to json object
  strict: true,  // ตั้งค่าให้ตรวจสอบ JSON ที่ไม่ถูกต้องอย่างเคร่งครัด
  limit: '1mb',  // จำกัดขนาดของ body เพื่อป้องกันการส่งข้อมูลที่มากเกินไป
}));

app.use(cookieParser()) //ทำให้ใช้งาน cookie ได้ผ่าน backend

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err.message);
    return res.status(400).send({ msg: "Bad JSON format" });
  }
  next();
});

//กำหนดต้นทางหรือ origin ที่จะเข้ามาใช้ API ของเรา
app.use(cors({
  credential: true,
  origin: ["http://localhost:5173"], //กำหนดอยู่ใน vite.config
}));

//อนุญาติการใช้ session storage
app.use(session ({
  secret: process.env.SEESION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    //http : false or https : true
    secure: 'auto',
  }
}))

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running `);
})


//เอาไว้ข้างล่างเพราะว่า ต้อง set ค่าต่างๆจากด้านบนก่อนอย่างเช่น session ที่ set ด้านบน ที่มีอยู่ใน authRoute 
app.use(customerRoute);
app.use(orderRounte);
app.use(materialRounte);
app.use(authRoute);
app.use(adminRoute);