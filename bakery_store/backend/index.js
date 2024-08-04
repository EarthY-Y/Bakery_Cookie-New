//import,require ตัว packet ที่เราต้องการใช้เข้ามา
import cors from "../../node_modules/cors";
import session from "../../node_modules/express-session";
import dotenv from "../../node_modules/dotenv";
const express = require('../../node_modules/express')
const mysql = require('../../node_modules/mysql')

dotenv.config();
app.use(express.json());

//เรียกใช้ express ด้วย app
const app = express();

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