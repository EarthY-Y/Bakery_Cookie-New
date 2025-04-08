//import,require ตัว packet ที่เราต้องการใช้เข้ามา
import express from'express';
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

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
import CategoryOrderStatus from "./routes/admin/categoryOrderStatus-Route.js"
import AddressCustomerRoute from "./routes/customer/addressCustomer-Route.js"
import OrderTrackingRoute from './routes/customer/orderTracking-Route.js';
import PackageRoute from './routes/admin/package-Route.js'
import ShippingRoute from './routes/admin/shippingCost-Route.js'
import GuestProductRoute from './routes/guest/guestProduct-Route.js'
import DashboardRoute from './routes/admin/dashboardRoute.js'
import OrderHistoryRoute from './routes/admin/orderHistory-Route.js'
import ManageCustomer from './routes/admin/manageCustomer-Route.js'

import {getTokenPostTH} from './controller/thailandPost.js'

import cookieParser from 'cookie-parser'
import path from 'path'
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

//ใน ES Module ไม่มี __filename, __dirname เพื่อให้ Server สามารถใช้งาน folder ได้
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//เรียกใช้ express ด้วย app
const app = express();

//เรียกใช้งานไฟล์ที่อยู่ในโฟลเดอร์ upload โดยใช้ express.static เพื่อให้สามารถเข้าถึงโฟลเดอร์ได้จากภายนอก
app.use('/picture', express.static(path.join(__dirname, 'picture'))); //เรียกใช้ก่อน Helmet เพราะว่า Helmet จะทำให้ไม่สามารถเข้าถึงไฟล์ได้จาก origin อื่นได้
app.use('/picture/upload/package', express.static(path.join(__dirname, 'upload/image/package')));
app.use('/picture/upload/material', express.static(path.join(__dirname, 'upload/image/material')));
app.use('/picture/upload/product', express.static(path.join(__dirname, 'upload/image/product')));
app.use('/picture/upload/profile/customer', express.static(path.join(__dirname, 'upload/image/profileCustomer')));
app.use('/picture/upload/profile/admin', express.static(path.join(__dirname, 'upload/image/profileAdmin')));
app.use('/picture/upload/payment', express.static(path.join(__dirname, 'upload/image/payment')));

app.use(helmet({ //ใช้ helmet เพื่อป้องกันการโจมตีต่างๆ
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // อนุญาตแค่แหล่งข้อมูลที่มาจากตัวเอง
      scriptSrc: ["'self'", `${process.env.FRONTEND}`], // อนุญาตแค่สคริปต์จากตัวเองและ CDN ที่เชื่อถือได้
      connectSrc: ["'self'", `${process.env.THAILANDPOST}`], // อนุญาตให้ทำการเชื่อมต่อจาก Thailand Post API
    },
  },
}));

//app.use(bodyParser.urlencoded({ extended: true })); //ใช้ body-parser เพื่อแปลงข้อมูลที่ส่งมาจาก client เป็น JSON object

const limiterAPIAuth = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

/*การเเยก rate limit สำหรับ API เเต่ละประเภทจะช่วยเพิ่มความเสรียมให้กับ API ของเรา
โดยการกำหนดจำนวน request ที่อนุญาตในช่วงเวลาที่กำหนด */
const limiterAPI = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 500,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // ส่งคืน headers มาตรฐาน (X-RateLimit-*)
  legacyHeaders: false, // ปิดการใช้งาน `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    console.log('User hit the limit:', req.ip)
    res.status(429).json({
      message: 'Too many requests, please try again later.'
    })
  }
});
 
app.use(express.json({ //convert object to json object
  strict: true,  // ตั้งค่าให้ตรวจสอบ JSON ที่ไม่ถูกต้องอย่างเคร่งครัด
  limit: '1mb',  // จำกัดขนาดของ body เพื่อป้องกันการส่งข้อมูลที่มากเกินไป
}));

app.use(cookieParser()) //ทำให้ใช้งาน cookie ได้ผ่าน backend

//กำหนดต้นทางหรือ origin ที่จะเข้ามาใช้ API ของเรา
app.use(cors({
  origin: [process.env.FRONTEND,process.env.THAILANDPOST], //กำหนดอยู่ใน vite.config
  //methods: ['GET', 'POST'], // วิธีการที่อนุญาต
  // credentials: true,
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

//ตอนนี้ render ที่เป็น  Hosting ฝั่ง server จะ sleep ทุก 15 นาทีถ้าไม่มีคนใช้งาน
getTokenPostTH().then(() => {
  console.log("🚀 Server started with tracking token!");
});

//เอาไว้ข้างล่างเพราะว่า ต้อง set ค่าต่างๆจากด้านบนก่อนอย่างเช่น session ที่ set ด้านบน ที่มีอยู่ใน authRoute 
app.use(customerRoute/* , limiterAPI */)
app.use(orderRounte/* , limiterAPI */)
app.use(materialRounte/* , limiterAPI */)
app.use(productRoute/* , limiterAPI */)
app.use(PackageRoute/* , limiterAPI */)
app.use(authRoute/*, limiterAPIAuth */)
app.use(adminRoute/* , limiterAPI */)
app.use(paymentRoute/* , limiterAPI */)
app.use(AddressRoute/* , limiterAPI */)
app.use(StatusShippingRoute/* , limiterAPI */)
app.use(StatusCartRoute/* , limiterAPI */)
app.use(CategoryRoute/* , limiterAPI */)
app.use(CategoryPackageRoute/* , limiterAPI */);
app.use(CategoryOrderStatus/* , limiterAPI */)
app.use(OrderTrackingRoute/* , limiterAPI */);
app.use(OrderHistoryRoute/* , limiterAPI */)
app.use(productCustomerRoute/* , limiterAPI */);
app.use(provinceAmphureTambon/* , limiterAPI */);
app.use(AddressCustomerRoute/* , limiterAPI */);
app.use(ShippingRoute/* , limiterAPI */);
app.use(GuestProductRoute/* , limiterAPI */)
app.use(DashboardRoute/* , limiterAPI */)
app.use(ManageCustomer/* , limiterAPI */)

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running `);
})




