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
import ErrorBoundary from '../components/error/ErrorBoundary'
import { ErrorFallback } from '../components/error/errorFallback'
import { FormProvider } from '../API/signUpService'

const router = createBrowserRouter([
  {
    path: "",
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        children: [
          {
            path: "",
            element: (
              <FormProvider>  {/* ห่อหุ้มด้วย FormProvider ที่นี่ */}
                <Signup />
              </FormProvider>
            ),
          },
          {
            path: "step2",
            element: (
              <FormProvider>  {/* ห่อหุ้มด้วย FormProvider ที่นี่ */}
                <Signup2 />
              </FormProvider>
            ),
          },
          {
            path: "step3",
            element: (
              <FormProvider>  {/* ห่อหุ้มด้วย FormProvider ที่นี่ */}
                <Signup3 />
              </FormProvider>
            ),
          },
        ],
      },
    
      //route Admin
      {
        element: <ProtectedRouteAdmin />, // ใช้ ProtectedLayout ที่นี่
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
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
        element: <ProtectedRouteCustomer />, // ใช้ ProtectedLayout ที่นี่
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
    ]
  },

]);

function App() {
  return (
    <div>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </div>
  );
}

export default App
