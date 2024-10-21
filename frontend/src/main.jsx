import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css' 

createRoot(document.getElementById('root')).render(
  // <StrictMode> //StrictMode ทำให้เกิดการ render สองครั้งในระหว่างการพัฒนา response ที่ได้เบิ้ลเป็นสองรอบ
  //   <App />
  // </StrictMode>,
  <App /> // ถอด StrictMode ออกชั่วคราว
)
