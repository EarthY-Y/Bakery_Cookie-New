import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router-dom'
import Dashboard from '../page/admin-page/dashboard/dashboard'
import Login from '../page/login-page/login-page'
import Product from '../page/admin-page/product-page/listProduct-page'
import ListMaterial from '../page/admin-page/material-page/listMaterial-page'
import CreateMaterial from '../page/admin-page/material-page/createMaterial-page'
import CreateAdmin from '../page/admin-page/createAdmin-page'
import Admin from '../page/admin-page/listAdmin-page'
import Signup from '../page/customer-page/signup-page/signup-page'
import Signup2 from '../page/customer-page/signup-page/signup2-page'
import Signup3 from '../page/customer-page/signup-page/signup3-page'
import ListAdmin from '../page/admin-page/listAdmin-page'
import {ProtectedRouteAdmin ,ProtectedRouteCustomer} from '../API/authService';
import Home from '../page/customer-page/home/home-page'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    children: [
      {
        path: "",
        element: <Signup />,
      },
      {
        path: "step2",
        element: <Signup2 />,
      },
      {
        path: "step3",
        element: <Signup3 />,
      },
    ],
  },
  //route Admin
  {
    // element: <ProtectedRouteAdmin />, // ใช้ ProtectedLayout ที่นี่
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <div>404 Not Found</div>,
      },
      {
        path: "/material",
        children: [
          {
            path: "",
            element: <ListMaterial />,
          },
          {
            path: "create", // ลบ '/' หน้า path
            element: <CreateMaterial />,
          },
        ],
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/admin",
        children: [
          {
            path: "",
            element: <ListAdmin />,
          },
          {
            path: "create",
            element: <CreateAdmin />,
          },
        ],
      },
    ],
  },

  //route User
  {
    path: "",
    element: <Home />,
  },
  {
    // element: <ProtectedRouteCustomer />, // ใช้ ProtectedLayout ที่นี่
    children: [
      {
        path: "/home",
        children: [
          {
            path: "",
            element: <Home />,
          },
        ],
      },
    ],
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App
