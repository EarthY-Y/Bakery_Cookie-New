import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '../public/vite.svg'
import { BrowserRouter, Routes,  Route} from 'react-router-dom'
import Dashboard from '../components/admin/dashboard'
import Login from '../components/login-page/login-page'


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
