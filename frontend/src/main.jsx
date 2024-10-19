import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css' 
// Import CSS ของ Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Import JavaScript ของ Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
