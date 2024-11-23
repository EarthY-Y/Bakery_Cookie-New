import { useState } from 'react'
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router-dom'
import {ProtectedRouteAdmin ,ProtectedRouteCustomer} from '../API/authService';
import Dashboard from '../page/admin-page/dashboard/dashboard'
import Login from '../page/login-page/login-page'
import LoginAdmin from '../page/login-page/loginAdmin-page';
import ListProduct from '../page/admin-page/product-page/listProduct-page'
import ListPorductById from '../page/admin-page/product-page/listPorductById-page'
import EditPorductById from '../page/admin-page/product-page/EditProduct-page'
import ListMaterial from '../page/admin-page/material-page/listMaterial-page'
import ListMaterialById from '../page/admin-page/material-page/listByIdMaterial-page';
import EditMaterial from '../page/admin-page/material-page/editMaterial-page';
import CreateMaterial from '../page/admin-page/material-page/createMaterial-page'
import CreateAdmin from '../page/admin-page/createAdmin-page'
import Admin from '../page/admin-page/listAdmin-page'
import Signup from '../page/customer-page/signup-page/signup-page'
import Signup2 from '../page/customer-page/signup-page/signup2-page'
import Signup3 from '../page/customer-page/signup-page/signup3-page'
import ListAdmin from '../page/admin-page/listAdmin-page'
import CreateProductMaterial from '../page/admin-page/product-page/createMaterialProduct-page';
import Home from '../page/customer-page/home/home-page'
import GuestHome from '../page/customer-page/home/guestHome-page'
import ErrorBoundary from '../components/error/ErrorBoundary'
import { ErrorFallback } from '../components/error/errorFallback'
import { FormProviderSignUpService } from '../API/signUpService'
import { FormProviderProductService } from '../API/admin/productService'
import CreateProduct from '../page/admin-page/product-page/createProduct-page'
import DetailPorductById from '../page/customer-page/product/detailPorductById-page';
import Cart from '../page/customer-page/cart-page/cartProduct-page';
import Payment from '../page/customer-page/cart-page/payment-page';
import CreateAddress from '../page/customer-page/profile-page/createAddress-page';
import LisetOrder from '../page/admin-page/order-page/listOrders-page'
import Orders from '../page/customer-page/cart-page/orders-page';
import OrderById from '../page/admin-page/order-page/ordersBtId-page';
import Status from '../page/admin-page/order-page/status/status-page';
import CreateStatus from '../page/admin-page/order-page/status/createStatus-page'
import EditCratStatus from '../page/admin-page/order-page/status/editCartStatus-page'
import EditOrderStatus from '../page/admin-page/order-page/status/editOrderStatus-page'
import Categoey from '../page/admin-page/category/listCategory-page';
import CreateCategory from '../page/admin-page/category/createCategory-page'
import EditCategory from '../page/admin-page/category/editCategory-page';
import CategoryById from '../page/admin-page/category/categoryById-page'
import Profile from '../page/customer-page/profile-page/profile-page';
import ListAddress from '../page/customer-page/profile-page/listAddress-page'
import EditAddress from '../page/customer-page/profile-page/editAddress-page'
import OrderTracking from '../page/customer-page/profile-page/orderTracking-page'
import OrderTrackingDetail from '../page/customer-page/profile-page/orderTrackingDetail-page';
import HistoryOrder from '../page/customer-page/profile-page/historyOrder-page';

const router = createBrowserRouter([
  {
    path: "",
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "",
        element: <GuestHome />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/login/admin",
        element: <LoginAdmin />,
      },
      {
        path: "/signup",
        children: [
          {
            path: "",
            element: (
              <FormProviderSignUpService>  {/* ห่อหุ้มด้วย FormProviderSignUpService ที่นี่ */}
                <Signup />
              </FormProviderSignUpService>
            ),
          },
          {
            path: "step2",
            element: (
              <FormProviderSignUpService>  {/* ห่อหุ้มด้วย FormProviderSignUpService ที่นี่ */}
                <Signup2 />
              </FormProviderSignUpService>
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
                path: "view/:id",
                element: <ListMaterialById />,
              },
              {
                path: "create", // ลบ '/' หน้า path
                element: <CreateMaterial />,
              },
              {
                path: "edit/:id",
                element: <EditMaterial />,
              },
            ],
          },
          {
            path: "/category",
            children: [
              {
                path: "",
                element: <Categoey />,
              },
              {
                path: "view/:id",
                element: <CategoryById />,
              },
              {
                path: "create",
                element: <CreateCategory />,
              },
              {
                path: "edit/:id",
                element: <EditCategory />,
              },
            ],
          },
          {
            path: "/product",
            children: [
              {
                path: "",
                element: <ListProduct />,
              },
              {
                path: "view/:id",
                element: <ListPorductById />,
              },
              {
                path: "create", // ลบ '/' หน้า path
                children: [
                  {
                    path: "",
                    element: (
                      <FormProviderProductService>
                        <CreateProduct />
                      </FormProviderProductService>
                      ),
                  },
                  {
                    path: "materialproduct", // ลบ '/' หน้า path
                    element: (
                    <FormProviderProductService>
                      <CreateProductMaterial />
                    </FormProviderProductService>
                    ),
                  },
                ]
                
              },
              {
                path: "edit/:id",
                element: <EditPorductById />,
              },
            ],
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
          {
            path: "/orderslist",
            children: [
              {
                path: "",
                element: <LisetOrder />,
              },
              {
                path: "view/detail/order/:id",
                element: <OrderById />,
              },
            ],
          },
          {
            path: "/status",
            children: [
              {
                path: "",
                element: <Status />,
              },
              {
                path: "create",
                element: <CreateStatus/>
              },
              {
                path: "edit/cart/:id",
                element: <EditCratStatus/>
              },
              {
                path: "edit/order/:id",
                element: <EditOrderStatus/>
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
          {
            path: "/product/:id",
            element: <DetailPorductById />,
          },
          {
            path: "/cart/:id",
            children: [
              {
                path: "",
                element: <Cart />,
              },
            ],
          },
          {
            path: "/orders/:id",
            element: <Orders />,
          },
          {
            path: "/payment/:id",
            element: <Payment />,
          },
          {
            path: "/create/address",
            children: [
              {
                path: "",
                element: <CreateAddress />,
              },
            ],
          },
          {
            path: "/profile",
            children: [
              {
                path: "",
                element: <Profile />,
              },
              {
                path: "customer/address",
                children: [
                  {
                    path: "",
                    element: <ListAddress />,
                  },
                  {
                    path: "edit/:id",
                    element: <EditAddress />,
                  },
                ],
              },
              {
                path: "orderTracking",
                children: [
                  {
                    path: "",
                    element: <OrderTracking />,
                  },
                  {
                    path: "view/detail/:id",
                    element: <OrderTrackingDetail />,
                  },
                ]
              },
              {
                path: "orderHistory",
                children: [
                  {
                    path: "",
                    element: <HistoryOrder />,
                  },
                  {
                    path: "view/detail/:id",
                    element: <OrderTrackingDetail />,
                  },
                ]
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
