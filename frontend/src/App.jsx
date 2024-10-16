import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter, Routes,  Route } from 'react-router-dom'
import Dashboard from '../page/dashboard/dashboard'
import Login from '../page/login-page/login-page'
import Product from '../page/product-page/listProduct-page'
import Material from '../page/material-page/listMaterial-page'
import CreateMaterial from '../page/material-page/createMaterial-page'
import CreateAdmin from '../page/admin-page/createAdmin-page'
import Admin from '../page/admin-page/listAdmin-page'
import Signup from '../page/signup-page/signup-page'
import Signup2 from '../page/signup-page/signup2-page'
import Signup3 from '../page/signup-page/signup3-page'


function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup2" element={<Signup2 />} />
          <Route path="/signup3" element={<Signup3 />} />
          <Route path="/product" element={<Product />} />
          <Route path="/material" element={<Material />} />
          <Route path="/material/create" element={<CreateMaterial />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/create" element={<CreateAdmin />} />
        </Routes> 
      </BrowserRouter>
    </div>
  )
}

export default App
