//import,require ตัว packet ที่เราต้องการใช้เข้ามา
import express from'express';
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import customerRoute from "./routes/customer/customer-Route.js";
import orderRounte from "./routes/admin/order-Route.js";
import materialRounte from "./routes/admin/material-Route.js";
import adminRoute from "./routes/admin/admin-Route.js";
import authRoute from "./routes/auth-Route.js"
import provinceAmphureTambon from "./routes/addressRoute.js"
import productRoute from "./routes/admin/product-Route.js"
import productCustomerRoute from "./routes/customer/product-Route.js"
import paymentRoute from "./routes/customer/payment-Route.js"
import AddressRoute from "./routes/addressRoute.js"
import StatusShippingRoute from "./routes/admin/statusOrder-Route.js"
import StatusCartRoute from './routes/admin/statusCart-Route.js'
import CategoryRoute from "./routes/admin/category-Route.js"
import CategoryPackageRoute from "./routes/admin/categoryPackage-Route.js"
import AddressCustomerRoute from "./routes/customer/addressCustomer-Route.js"
import OrderTrackingRoute from './routes/customer/orderTracking-Route.js';
import PackageRoute from './routes/admin/package-Route.js'
import ShippingRoute from './routes/admin/shippingCost-Route.js'
import GuestProductRoute from './routes/guest/guestProduct-Route.js'
import DashboardRoute from './routes/admin/dashboardRoute.js'
import OrderHistoryRoute from './routes/admin/orderHistory-Route.js'
import cookieParser from 'cookie-parser'
import path from 'path'
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
  
//เรียกใช้ express ด้วย app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

app.use(bodyParser.json()); 
app.use(express.json({ //convert object to json object
  strict: true,  // ตั้งค่าให้ตรวจสอบ JSON ที่ไม่ถูกต้องอย่างเคร่งครัด
  limit: '1mb',  // จำกัดขนาดของ body เพื่อป้องกันการส่งข้อมูลที่มากเกินไป
}));


app.use(cookieParser()) //ทำให้ใช้งาน cookie ได้ผ่าน backend

//กำหนดต้นทางหรือ origin ที่จะเข้ามาใช้ API ของเรา
app.use(cors({
  origin: process.env.FRONTEND, //กำหนดอยู่ใน vite.config
  //methods: ['GET', 'POST'], // วิธีการที่อนุญาต
  credential: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Header ที่อนุญาต
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

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running `);
})
app.use('/picture', express.static(path.join(__dirname, 'picture')));
//เอาไว้ข้างล่างเพราะว่า ต้อง set ค่าต่างๆจากด้านบนก่อนอย่างเช่น session ที่ set ด้านบน ที่มีอยู่ใน authRoute 
app.use(customerRoute)
app.use(orderRounte)
app.use(materialRounte)
app.use(productRoute)
app.use(PackageRoute)
app.use(authRoute)
app.use(adminRoute)
app.use(paymentRoute)
app.use(AddressRoute)
app.use(StatusShippingRoute)
app.use(StatusCartRoute)
app.use(CategoryRoute)
app.use(CategoryPackageRoute);
app.use(OrderTrackingRoute);
app.use(OrderHistoryRoute)
app.use(productCustomerRoute);
app.use(provinceAmphureTambon);
app.use(AddressCustomerRoute);
app.use(ShippingRoute);
app.use(GuestProductRoute)
app.use(DashboardRoute)
