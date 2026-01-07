import {RouterProvider, createBrowserRouter, Navigate} from 'react-router-dom';
import Home from './assets/pages/Home';
import FarmerAssistance from './assets/pages/FarmerAssistance';
import Order from './assets/pages/Order';
import Orders from './assets/pages/Orders';
import Marketplace from './assets/pages/Marketplace'
import Cart from './assets/pages/Cart';
import { AppLayout } from './assets/Components/AppLayout';
import Login from './assets/Components/Login';
import Register from './assets/Components/Registration';
import FarmerDashboard from './assets/pages/Farmer';
import About from './assets/pages/About';
import Products from './assets/pages/Products';
import Services from './assets/pages/Services';
import Prices from './assets/pages/Prices';
import Weather from './assets/pages/Weather';
import Blog from './assets/pages/Blog';
import Gallery from './assets/pages/Gallery';
import Contact from './assets/pages/Contact';
import SmartCropPlanning from './assets/pages/SmartCropPlanning';
import AIFarmingCalendar from './assets/pages/AIFarmingCalendar';
import AIFarmingChatbot from './assets/pages/AIFarmingChatbot';
import ARProductScanner from './assets/pages/ARProductScanner';
import CommunityImpactTracker from './assets/pages/CommunityImpactTracker';
import Settings from './assets/pages/Settings';
import { AdminLayout } from './admin/Layout';
import AdminDashboard from './admin/Dashboard';
import AdminUsers from './admin/Users';
import AdminSettings from './admin/Settings';
import AdminRoute from './admin/AdminRoute';
import ProtectedRoute from './assets/Components/ProtectedRoute';
import Welcome from './assets/pages/Welcome';
import FarmingCalendar from './assets/pages/FarmingCalendar';
import FarmerCommunity from './assets/pages/FarmerCommunity';


export const App = ()=>{
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Welcome/>
    },
    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/register",
      element:<Register/>
    },
    {
      path:"/",
      element:(
        <ProtectedRoute>
          <AppLayout/>
        </ProtectedRoute>
      ),
      children  : [
      {
        path:"/home",
        element:<Home />,
      },
      {
       path:"/marketplace",
       element:<Marketplace/>
      },
      {
       path:"/farmer-assistance",
       element:<FarmerAssistance/>
      },
      {
       path:"/order",
       element:<Order/>
      },
      {
       path:"/orders",
       element:<Orders/>
      },
      {
       path:"/cart",
       element:<Cart/>
      },
      {
        path:"/about",
        element:<About/>
      },
      {
        path:"/products",
        element:<Products/>
      },
      {
        path:"/services",
        element:<Services/>
      },
      {
        path:"/prices",
        element:<Prices/>
      },
      {
        path:"/weather",
        element:<Weather/>
      },
      {
       path:"/blog",
       element:<Blog/>
      },
      {
        path:"/subscription",
        element:<Navigate to="/farmer-assistance" replace />
      },
      {
       path:"/gallery",
       element:<Gallery/>
      },
      {
        path:"/contact",
        element:<Contact/>
      },
      {
        path:"/smart-crop-planning",
        element:<SmartCropPlanning/>
      },
      {
       path:"/ai-farming-calendar",
       element:<AIFarmingCalendar/>
      },
      {
       path:"/farming-calendar",
       element:<FarmingCalendar/>
      },
      {
       path:"/community",
       element:<FarmerCommunity/>
      },
      {
        path:"/ai-farming-chatbot",
        element:<AIFarmingChatbot/>
      },
      {
        path:"/ar-product-scanner",
        element:<ARProductScanner/>
      },
      {
        path:"/community-impact-tracker",
        element:<CommunityImpactTracker/>
      },
      {
        path:"/settings",
        element:<Settings/>
      }
      

    ]},
    {
      path: "/admin",
      element: (
        <AdminLayout />
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "users", element: <AdminUsers /> },
        { path: "settings", element: <AdminSettings /> },
        { path: "products", element: <Marketplace /> },
        { path: "services", element: <Services /> },
        { path: "gallery", element: <Gallery /> },
        { path: "community", element: <FarmerCommunity /> }
      ]
    },
    {
      path:"/farmerdashboard",
      element:(
        <ProtectedRoute>
          <FarmerDashboard/>
        </ProtectedRoute>
      )
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />
    }
  ]);

  return <RouterProvider router={router}/>
}