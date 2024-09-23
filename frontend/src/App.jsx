import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router-dom'
import Dashboard from '../page/dashboard/dashboard'
import Login from '../page/login-page/login-page'
import Product from '../page/product-page/listProduct-page'
import ListMaterial from '../page/material-page/listMaterial-page'
import CreateMaterial from '../page/material-page/createMaterial-page'
import CreateAdmin from '../page/admin-page/createAdmin-page'
import ListAdmin from '../page/admin-page/listAdmin-page'

const router = createBrowserRouter( [
  {
    path: "/",
    element: <Dashboard />,
    errorElement:<div>404 Not Found</div>
  },
  {
    path: "/material",
    children: [
      {
        path: "",
        element: <ListMaterial />,
      },
      {
        path: "/material/create",
        element: <CreateMaterial />,
      },
      // {
      //   path: "/material/:id",
      //   element: <EditMaterial />,
      // }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/product",
    element: <Product />,
    // children: [
    //   {
    //     path: "product/:id", 
    //     element: <EditProduct />,
    //   },
    // ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "", 
        element: <ListAdmin />,
      },
      {
        path: "/admin/create",
        element: <CreateAdmin />,
      },
      // {
      //   path: "edit/:id", 
      //   element: <EditAdmin />,
      // },
    ],
  },
  
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App
