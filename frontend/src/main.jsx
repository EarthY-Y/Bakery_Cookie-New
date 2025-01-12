import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css' 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
<script src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>

createRoot(document.getElementById('root')).render(
  // <StrictMode> //StrictMode ทำให้เกิดการ render สองครั้งในระหว่างการพัฒนา response ที่ได้เบิ้ลเป็นสองรอบ
  //   <App />
  // </StrictMode>,
  <App /> // ถอด StrictMode ออกชั่วคราว
)
