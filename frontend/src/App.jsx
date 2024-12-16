import { useState } from 'react'
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router-dom'
import {ProtectedRouteAdmin ,ProtectedRouteCustomer, CheckRouteCustomer, CheckRouteAdmin} from '../API/authService';
import Dashboard from '../page/admin-page/dashboard-page/dashboard-page'
import Login from '../page/login-page/login-page'
import LoginLine from '../page/login-page/loginLine-page';
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
import ListAdmin from '../page/admin-page/listAdmin-page'
import CreateProductMaterial from '../page/admin-page/product-page/createMaterialProduct-page';
import Home from '../page/customer-page/home/home-page'
import GuestHome from '../page/guest/guestHome-page'
import GuestDetailPorductById from '../page/guest/guestDetailPorductById-page'
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
import ListHistoryOrders from '../page/admin-page/order-page/history-page/listHistoerOrders-page';
import OrderHistoryById from '../page/admin-page/order-page/history-page/ordersHistoryById-page';
import Orders from '../page/customer-page/cart-page/orders-page';
import OrderById from '../page/admin-page/order-page/ordersBtId-page';
import Status from '../page/admin-page/status/orders/status-page';
import CreateStatusOrder from '../page/admin-page/status/orders/createStatusOrder-page'
import EditOrderStatus from '../page/admin-page/status/orders/editOrderStatus-page'
import StatusCart from '../page/admin-page/status/cart/statusCart-page';
import CreateStatusCart from '../page/admin-page/status/cart/createStatusCart-page'
import EditCratStatus from '../page/admin-page/status/cart/editCartStatus-page'
import Categoey from '../page/admin-page/category/categoryProduct/listCategory-page';
import CreateCategory from '../page/admin-page/category/categoryProduct/createCategory-page'
import EditCategory from '../page/admin-page/category/categoryProduct/editCategory-page';
import CategoryById from '../page/admin-page/category/categoryProduct/categoryById-page'
import ListCategoryPackage from '../page/admin-page/category/categoryPackge/listCategoryPackage-page';
import CreateCategoryPackage from '../page/admin-page/category/categoryPackge/createCategoryPackage-page'
import EditCategoryPackage from '../page/admin-page/category/categoryPackge/editCategoryPackage-page';
import CategoryByIdPackage from '../page/admin-page/category/categoryPackge/categoryPackgeById-page'
import Profile from '../page/customer-page/profile-page/profile-page';
import ChangePassword from '../page/customer-page/profile-page/changePassword-page';
import ListAddress from '../page/customer-page/profile-page/listAddress-page'
import EditAddress from '../page/customer-page/profile-page/editAddress-page'
import OrderTracking from '../page/customer-page/profile-page/orderTracking-page'
import OrderTrackingDetail from '../page/customer-page/profile-page/orderTrackingDetail-page';
import HistoryOrder from '../page/customer-page/profile-page/historyOrder-page';
import CreatePackage from '../page/admin-page/package-page/createPackage-page';
import ListPackage from '../page/admin-page/package-page/listPackage-page';
import PackageById from '../page/admin-page/package-page/listPackageById-page';
import EditPackageById from '../page/admin-page/package-page/editPackage-page';
import ListShippingCost from '../page/admin-page/shippingCost-page/listShippingCost-page'
import ListShippingCostById from '../page/admin-page/shippingCost-page/listShippingCostById-page'
import EditShippingCost from '../page/admin-page/shippingCost-page/editShippingCost-page'
import CreateShippingCost from '../page/admin-page/shippingCost-page/createShippingCost-page'
import ManagerCustomer from '../page/admin-page/manageCustomer-page/manageCustomer-page';
import EditManagerCustomer from '../page/admin-page/manageCustomer-page/manageCustomerById-page';

const router = createBrowserRouter([
  {
    path: "",
    errorElement: <ErrorFallback />,
    children: [
      {
        element: <CheckRouteCustomer/>,
        children: [
          {
            path: "",
            element: <GuestHome />,
          },
          {
            path: "Cookie&New/:id",
            element: <GuestDetailPorductById />,
          },
          {
            path: "/login",
            children: [
              {
                path: '',
                element: <Login />,
              },
              {
                path: 'line',
                element: <LoginLine />,
              }
            ]
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
        ]
      },  
      {
        element: <CheckRouteAdmin/>,
        children: [
          {
            path: "/login/admin",
            element: <LoginAdmin />,
          }
        ]
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
            path: "/shipping",
            children: [
              {
                path: "",
                element: <ListShippingCost />,
              },
              {
                path: "view/:id",
                element: <ListShippingCostById />,
              },
              {
                path: "create", // ลบ '/' หน้า path
                element: <CreateShippingCost />,
              },
              {
                path: "edit/:id",
                element: <EditShippingCost />,
              },
            ],
          },
          {
            path: "category",
            children: [
              {
                path: "prduct",
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
                path: "package",
                children: [
                  {
                    path: "",
                    element: <ListCategoryPackage />,
                  },
                  {
                    path: "view/:id",
                    element: <CategoryByIdPackage />,
                  },
                  {
                    path: "create",
                    element: <CreateCategoryPackage />,
                  },
                  {
                    path: "edit/:id",
                    element: <EditCategoryPackage />,
                  },
                ],
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
            path: "/package",
            children: [
              {
                path: "",
                element: <ListPackage />,
              },
              {
                path: "view/:id",
                element: <PackageById />,
              },
              {
                path: "create", // ลบ '/' หน้า path
                element: <CreatePackage/>
              },
              {
                path: "edit/:id",
                element: <EditPackageById />,
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
            path: "/ordershistory",
            children: [
              {
                path: "",
                element: <ListHistoryOrders />,
              },
              {
                path: "view/detail/order/:id",
                element: <OrderHistoryById />,
              },
            ],
          },
          {
            path: "/status",
            children: [
              {
                path: "orders",
                children: [
                  {
                    path: "",
                    element: <Status />,
                  },
                  {
                    path: "create",
                    element: <CreateStatusOrder />
                  },
                  {
                    path: "edit/order/:id",
                    element: <EditOrderStatus/>
                  },
                ]
              },
              {
                path: "cart",
                children: [
                  {
                    path: "",
                    element: <StatusCart />,
                  },
                  {
                    path: "create",
                    element: <CreateStatusCart/>
                  },
                  {
                    path: "edit/cart/:id",
                    element: <EditCratStatus/>
                  },
                ]
              },
            ],
          },
          {
            path: "manager/customer",
            children: [
              {
                path: "",
                element: <ManagerCustomer />,
              },
              {
                path: "view/:id",
                element: <EditManagerCustomer/>
              },
            ]
          },
        ],
      },
    
      //route User
      {
        element: <ProtectedRouteCustomer />, // ใช้ ProtectedLayout ที่นี่
        children: [
          {
            path: "/home",
            element: <Home />,
          },
          {
            path: "/product/:id",
            element: <DetailPorductById />,
          },
          {
            path: "/cart/:id",
            element: <Cart />,
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
                path: "changePassword",
                element: <ChangePassword />,
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
