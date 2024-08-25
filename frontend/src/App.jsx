import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '../public/vite.svg'
import { BrowserRouter, Routes,  Route} from 'react-router-dom'
import Dashboard from '../page/dashboard/dashboard'
import Login from '../page/login-page/login'


function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login-page" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
