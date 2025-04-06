import { useState, lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRouteAdmin, ProtectedRouteCustomer, CheckRouteCustomer, CheckRouteAdmin } from '../API/authService'
import ErrorBoundary from '../components/error/ErrorBoundary'
import { ErrorFallback } from '../components/error/errorFallback'
import { FormProviderSignUpService } from '../API/signUpService'
import { FormProviderProductService } from '../API/admin/productService'
import LoadingSpinner from '../components/untils/popUp/LoadingSpinner' // สมมติว่ามี component นี้อยู่แล้ว

// Lazy load components based on routes
// Guest and Auth Components
const GuestHome = lazy(() => import('../page/guest/guestHome-page'))
const Login = lazy(() => import('../page/login-page/login-page'))
const LoginLine = lazy(() => import('../page/login-page/loginLine-page'))
const Signup = lazy(() => import('../page/customer-page/signup-page/signup-page'))
const Signup2 = lazy(() => import('../page/customer-page/signup-page/signup2-page'))
const GuestDetailPorductById = lazy(() => import('../page/guest/guestDetailPorductById-page'))
const CategoryProductListGuest = lazy(() => import('../page/guest/categoryProductList-page'))
const GuestLineOA = lazy(() => import('../page/guest/lineOA-page'))
const StepByStep = lazy(() => import('../page/guest/stepByStep-page'))

// Admin Components
const Dashboard = lazy(() => import('../page/admin-page/dashboard-page/dashboard-page'))
const ListAdmin = lazy(() => import('../page/admin-page/listAdmin-page'))
const CreateAdmin = lazy(() => import('../page/admin-page/createAdmin-page'))

// Admin - Product Management
const ListProduct = lazy(() => import('../page/admin-page/product-page/listProduct-page'))
const ListPorductById = lazy(() => import('../page/admin-page/product-page/listPorductById-page'))
const EditPorductById = lazy(() => import('../page/admin-page/product-page/EditProduct-page'))
const CreateProduct = lazy(() => import('../page/admin-page/product-page/createProduct-page'))
const CreateProductMaterial = lazy(() => import('../page/admin-page/product-page/createMaterialProduct-page'))

// Admin - Material Management
const ListMaterial = lazy(() => import('../page/admin-page/material-page/listMaterial-page'))
const ListMaterialById = lazy(() => import('../page/admin-page/material-page/listByIdMaterial-page'))
const EditMaterial = lazy(() => import('../page/admin-page/material-page/editMaterial-page'))
const CreateMaterial = lazy(() => import('../page/admin-page/material-page/createMaterial-page'))

// Admin - Orders Management
const LisetOrder = lazy(() => import('../page/admin-page/order-page/listOrders-page'))
const ListHistoryOrders = lazy(() => import('../page/admin-page/order-page/history-page/listHistoerOrders-page'))
const OrderHistoryById = lazy(() => import('../page/admin-page/order-page/history-page/ordersHistoryById-page'))
const OrderById = lazy(() => import('../page/admin-page/order-page/ordersBtId-page'))

// Admin - Status Management
const Status = lazy(() => import('../page/admin-page/status/orders/status-page'))
const CreateStatusOrder = lazy(() => import('../page/admin-page/status/orders/createStatusOrder-page'))
const EditOrderStatus = lazy(() => import('../page/admin-page/status/orders/editOrderStatus-page'))
const StatusCart = lazy(() => import('../page/admin-page/status/cart/statusCart-page'))
const CreateStatusCart = lazy(() => import('../page/admin-page/status/cart/createStatusCart-page'))
const EditCratStatus = lazy(() => import('../page/admin-page/status/cart/editCartStatus-page'))

// Admin - Category Management
const Categoey = lazy(() => import('../page/admin-page/category/categoryProduct/listCategory-page'))
const CreateCategory = lazy(() => import('../page/admin-page/category/categoryProduct/createCategory-page'))
const EditCategory = lazy(() => import('../page/admin-page/category/categoryProduct/editCategory-page'))
const CategoryById = lazy(() => import('../page/admin-page/category/categoryProduct/categoryById-page'))
const ListCategoryPackage = lazy(() => import('../page/admin-page/category/categoryPackge/listCategoryPackage-page'))
const CreateCategoryPackage = lazy(() => import('../page/admin-page/category/categoryPackge/createCategoryPackage-page'))
const EditCategoryPackage = lazy(() => import('../page/admin-page/category/categoryPackge/editCategoryPackage-page'))
const CategoryByIdPackage = lazy(() => import('../page/admin-page/category/categoryPackge/categoryPackgeById-page'))
const ListCategoryStatusOrder = lazy(() => import('../page/admin-page/category/categoryStatusOrder/listCategoryStatusOrder-page'))
const CreateCategoryStatusOrder = lazy(() => import('../page/admin-page/category/categoryStatusOrder/createCategoryStatusOrder-page'))
const EditCategoryStatusOrder = lazy(() => import('../page/admin-page/category/categoryStatusOrder/editCategoryStatusOrder-page'))
const CategoryByIdStatusOrder = lazy(() => import('../page/admin-page/category/categoryStatusOrder/categoryStatusOrderById-page'))

// Admin - Package Management
const CreatePackage = lazy(() => import('../page/admin-page/package-page/createPackage-page'))
const ListPackage = lazy(() => import('../page/admin-page/package-page/listPackage-page'))
const PackageById = lazy(() => import('../page/admin-page/package-page/listPackageById-page'))
const EditPackageById = lazy(() => import('../page/admin-page/package-page/editPackage-page'))

// Admin - Shipping Cost Management
const ListShippingCost = lazy(() => import('../page/admin-page/shippingCost-page/listShippingCost-page'))
const ListShippingCostById = lazy(() => import('../page/admin-page/shippingCost-page/listShippingCostById-page'))
const EditShippingCost = lazy(() => import('../page/admin-page/shippingCost-page/editShippingCost-page'))
const CreateShippingCost = lazy(() => import('../page/admin-page/shippingCost-page/createShippingCost-page'))

// Admin - Customer Management
const ManagerCustomer = lazy(() => import('../page/admin-page/manageCustomer-page/manageCustomer-page'))
const EditManagerCustomer = lazy(() => import('../page/admin-page/manageCustomer-page/manageCustomerById-page'))

// Customer Components
const Home = lazy(() => import('../page/customer-page/home/home-page'))
const LineOA = lazy(() => import('../page/customer-page/communicate-page/lineOA-page'))
const UserManual = lazy(() => import('../page/customer-page/home/stepByStep-page'))
const DetailPorductById = lazy(() => import('../page/customer-page/product/detailPorductById-page'))
const CategoryProductList = lazy(() => import('../page/customer-page/product/categoryProductList-page copy'))
const Cart = lazy(() => import('../page/customer-page/cart-page/cartProduct-page'))
const Orders = lazy(() => import('../page/customer-page/cart-page/orders-page'))
const Payment = lazy(() => import('../page/customer-page/cart-page/payment-page'))
const CreateAddress = lazy(() => import('../page/customer-page/profile-page/createAddress-page'))

// Customer - Profile Management
const Profile = lazy(() => import('../page/customer-page/profile-page/profile-page'))
const ChangePassword = lazy(() => import('../page/customer-page/profile-page/changePassword-page'))
const ListAddress = lazy(() => import('../page/customer-page/profile-page/listAddress-page'))
const EditAddress = lazy(() => import('../page/customer-page/profile-page/editAddress-page'))
const OrderTracking = lazy(() => import('../page/customer-page/profile-page/orderTracking-page'))
const OrderTrackingDetail = lazy(() => import('../page/customer-page/profile-page/orderTrackingDetail-page'))
const HistoryOrder = lazy(() => import('../page/customer-page/profile-page/historyOrder-page'))
import ErrorPopup from '../components/untils/popUp/errorPopup'

const RouteErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);

  // ฟังก์ชันสำหรับจัดการ error ที่เกิดขึ้นในระหว่างการโหลด component
  const handleError = (err) => {
    console.error("Route error:", err);
    setError(err.message || "เกิดข้อผิดพลาดในการโหลดหน้า");
    // คุณสามารถทำการ log error ไปยัง service หรือทำอย่างอื่นได้ที่นี่
  };

  // ล้าง error เมื่อปิด popup
  const clearError = () => {
    setError(null);
  };

  return (
    <>
      {error && (
        <ErrorPopup 
          message={error} 
          text="เชื่อมต่อล้มเหลว" 
          onClose={clearError} 
        />
      )}
      <ErrorBoundary onError={handleError}>
        {children}
      </ErrorBoundary>
    </>
  );
};
// Wrapping component for lazy loading with suspense
const SuspenseWrapper = ({ children }) => (
  <RouteErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </RouteErrorBoundary>
);
const router = createBrowserRouter([
  {
    path: "",
    errorElement: <ErrorFallback />,
    children: [
      {
        // element: <CheckRouteCustomer/>,
        children: [
          {
            path: "",
            element: <SuspenseWrapper><GuestHome /></SuspenseWrapper>,
          },
          {
            path: "Cookie&New/:id",
            element: <SuspenseWrapper><GuestDetailPorductById /></SuspenseWrapper>,
          },
          {
            path: "/list/category/product/:id",
            element: <SuspenseWrapper><CategoryProductListGuest /></SuspenseWrapper>,
          },
          {
            path: "/login",
            children: [
              {
                path: '',
                element: <SuspenseWrapper><Login /></SuspenseWrapper>,
              },
              {
                path: 'line',
                element: <SuspenseWrapper><LoginLine /></SuspenseWrapper>,
              }
            ]
          },
          {
            path: "/signup",
            children: [
              {
                path: "",
                element: (
                  <FormProviderSignUpService>
                    <SuspenseWrapper>
                      <Signup />
                    </SuspenseWrapper>
                  </FormProviderSignUpService>
                ),
              },
              {
                path: "step2",
                element: (
                  <FormProviderSignUpService>
                    <SuspenseWrapper>
                      <Signup2 />
                    </SuspenseWrapper>
                  </FormProviderSignUpService>
                ),
              },
            ],
          },
          {
            path: "guest-contact",
            element: <SuspenseWrapper><GuestLineOA /></SuspenseWrapper>,
          },
          {
            path: "guestManual",
            element: <SuspenseWrapper><StepByStep /></SuspenseWrapper>,
          },
        ]
      }, 
      
      //route Admin
      {
        element: <ProtectedRouteAdmin />,
        children: [
          {
            path: "/dashboard",
            element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>,
          },
          {
            path: "/material",
            children: [
              {
                path: "",
                element: <SuspenseWrapper><ListMaterial /></SuspenseWrapper>,
              },
              {
                path: "view/:id",
                element: <SuspenseWrapper><ListMaterialById /></SuspenseWrapper>,
              },
              {
                path: "create",
                element: <SuspenseWrapper><CreateMaterial /></SuspenseWrapper>,
              },
              {
                path: "edit/:id",
                element: <SuspenseWrapper><EditMaterial /></SuspenseWrapper>,
              },
            ],
          },
          {
            path: "/shipping",
            children: [
              {
                path: "",
                element: <SuspenseWrapper><ListShippingCost /></SuspenseWrapper>,
              },
              {
                path: "view/:id",
                element: <SuspenseWrapper><ListShippingCostById /></SuspenseWrapper>,
              },
              {
                path: "create",
                element: <SuspenseWrapper><CreateShippingCost /></SuspenseWrapper>,
              },
              {
                path: "edit/:id",
                element: <SuspenseWrapper><EditShippingCost /></SuspenseWrapper>,
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
                    element: <SuspenseWrapper><Categoey /></SuspenseWrapper>,
                  },
                  {
                    path: "view/:id",
                    element: <SuspenseWrapper><CategoryById /></SuspenseWrapper>,
                  },
                  {
                    path: "create",
                    element: <SuspenseWrapper><CreateCategory /></SuspenseWrapper>,
                  },
                  {
                    path: "edit/:id",
                    element: <SuspenseWrapper><EditCategory /></SuspenseWrapper>,
                  },
                ],
              },
              
              {
                path: "package",
                children: [
                  {
                    path: "",
                    element: <SuspenseWrapper><ListCategoryPackage /></SuspenseWrapper>,
                  },
                  {
                    path: "view/:id",
                    element: <SuspenseWrapper><CategoryByIdPackage /></SuspenseWrapper>,
                  },
                  {
                    path: "create",
                    element: <SuspenseWrapper><CreateCategoryPackage /></SuspenseWrapper>,
                  },
                  {
                    path: "edit/:id",
                    element: <SuspenseWrapper><EditCategoryPackage /></SuspenseWrapper>,
                  },
                ],
              },

              {
                path: "statusOrder",
                children: [
                  {
                    path: "",
                    element: <SuspenseWrapper><ListCategoryStatusOrder /></SuspenseWrapper>,
                  },
                  {
                    path: "view/:id",
                    element: <SuspenseWrapper><CategoryByIdStatusOrder /></SuspenseWrapper>,
                  },
                  {
                    path: "create",
                    element: <SuspenseWrapper><CreateCategoryStatusOrder /></SuspenseWrapper>,
                  },
                  {
                    path: "edit/:id",
                    element: <SuspenseWrapper><EditCategoryStatusOrder /></SuspenseWrapper>,
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
                element: <SuspenseWrapper><ListProduct /></SuspenseWrapper>,
              },
              {
                path: "view/:id",
                element: <SuspenseWrapper><ListPorductById /></SuspenseWrapper>,
              },
              {
                path: "create",
                children: [
                  {
                    path: "",
                    element: (
                      <FormProviderProductService>
                        <SuspenseWrapper>
                          <CreateProduct />
                        </SuspenseWrapper>
                      </FormProviderProductService>
                    ),
                  },
                  {
                    path: "materialproduct",
                    element: (
                      <FormProviderProductService>
                        <SuspenseWrapper>
                          <CreateProductMaterial />
                        </SuspenseWrapper>
                      </FormProviderProductService>
                    ),
                  },
                ]
              },
              {
                path: "edit/:id",
                element: <SuspenseWrapper><EditPorductById /></SuspenseWrapper>,
              },
            ],
          },
          {
            path: "/package",
            children: [
              {
                path: "",
                element: <SuspenseWrapper><ListPackage /></SuspenseWrapper>,
              },
              {
                path: "view/:id",
                element: <SuspenseWrapper><PackageById /></SuspenseWrapper>,
              },
              {
                path: "create",
                element: <SuspenseWrapper><CreatePackage /></SuspenseWrapper>,
              },
              {
                path: "edit/:id",
                element: <SuspenseWrapper><EditPackageById /></SuspenseWrapper>,
              },
            ],
          },
          {
            path: "/admin",
            children: [
              {
                path: "",
                element: <SuspenseWrapper><ListAdmin /></SuspenseWrapper>,
              },
              {
                path: "create",
                element: <SuspenseWrapper><CreateAdmin /></SuspenseWrapper>,
              },
            ],
          },
          {
            path: "/orderslist/:id",
            children: [
              {
                path: "",
                element: <SuspenseWrapper><LisetOrder /></SuspenseWrapper>,
              },
              {
                path: "view/detail/order/:id",
                element: <SuspenseWrapper><OrderById /></SuspenseWrapper>,
              },
            ],
          },
          {
            path: "/ordershistory",
            children: [
              {
                path: "",
                element: <SuspenseWrapper><ListHistoryOrders /></SuspenseWrapper>,
              },
              {
                path: "view/detail/order/:id",
                element: <SuspenseWrapper><OrderHistoryById /></SuspenseWrapper>,
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
                    element: <SuspenseWrapper><Status /></SuspenseWrapper>,
                  },
                  {
                    path: "create",
                    element: <SuspenseWrapper><CreateStatusOrder /></SuspenseWrapper>,
                  },
                  {
                    path: "edit/order/:id",
                    element: <SuspenseWrapper><EditOrderStatus /></SuspenseWrapper>,
                  },
                ]
              },
              {
                path: "cart",
                children: [
                  {
                    path: "",
                    element: <SuspenseWrapper><StatusCart /></SuspenseWrapper>,
                  },
                  {
                    path: "create",
                    element: <SuspenseWrapper><CreateStatusCart /></SuspenseWrapper>,
                  },
                  {
                    path: "edit/cart/:id",
                    element: <SuspenseWrapper><EditCratStatus /></SuspenseWrapper>,
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
                element: <SuspenseWrapper><ManagerCustomer /></SuspenseWrapper>,
              },
              {
                path: "view/:id",
                element: <SuspenseWrapper><EditManagerCustomer /></SuspenseWrapper>,
              },
            ]
          },
        ],
      },
    
      //route User
      {
        element: <ProtectedRouteCustomer />,
        children: [
          {
            path: "/home",
            element: <SuspenseWrapper><Home /></SuspenseWrapper>,
          },
          {
            path: "/contact",
            element: <SuspenseWrapper><LineOA /></SuspenseWrapper>,
          },
          {
            path: "userManual",
            element: <SuspenseWrapper><UserManual /></SuspenseWrapper>,
          },
          {
            path: "/product/:id",
            element: <SuspenseWrapper><DetailPorductById /></SuspenseWrapper>,
          },
          {
            path: "/category/:id",
            element: <SuspenseWrapper><CategoryProductList /></SuspenseWrapper>,
          },
          {
            path: "/cart/:id",
            element: <SuspenseWrapper><Cart /></SuspenseWrapper>,
          },
          {
            path: "/orders/:id",
            element: <SuspenseWrapper><Orders /></SuspenseWrapper>,
          },
          {
            path: "/payment/:id",
            element: <SuspenseWrapper><Payment /></SuspenseWrapper>,
          },
          {
            path: "/create/address",
            children: [
              {
                path: "",
                element: <SuspenseWrapper><CreateAddress /></SuspenseWrapper>,
              },
            ],
          },
          {
            path: "/profile",
            children: [
              {
                path: "",
                element: <SuspenseWrapper><Profile /></SuspenseWrapper>,
              },
              {
                path: "changePassword",
                element: <SuspenseWrapper><ChangePassword /></SuspenseWrapper>,
              },
              {
                path: "customer/address",
                children: [
                  {
                    path: "",
                    element: <SuspenseWrapper><ListAddress /></SuspenseWrapper>,
                  },
                  {
                    path: "edit/:id",
                    element: <SuspenseWrapper><EditAddress /></SuspenseWrapper>,
                  },
                ],
              },
              {
                path: "orderTracking/:id",
                children: [
                  {
                    path: "",
                    element: <SuspenseWrapper><OrderTracking /></SuspenseWrapper>,
                  },
                  {
                    path: "view/detail/:id",
                    element: <SuspenseWrapper><OrderTrackingDetail /></SuspenseWrapper>,
                  },
                ]
              },
              {
                path: "orderHistory/:id",
                children: [
                  {
                    path: "",
                    element: <SuspenseWrapper><HistoryOrder /></SuspenseWrapper>,
                  },
                  {
                    path: "view/detail/:id",
                    element: <SuspenseWrapper><OrderTrackingDetail /></SuspenseWrapper>,
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