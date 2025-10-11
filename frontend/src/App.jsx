import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import Home from './assets/pages/Home';
import Subscription from './assets/pages/Subscription';
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
import AIFarmingChatbot from './assets/pages/AIFarmingChatbot';
import ARProductScanner from './assets/pages/ARProductScanner';
import CommunityImpactTracker from './assets/pages/CommunityImpactTracker';


export const App = ()=>{
  const router = createBrowserRouter([
    {
    
      path:"/",
      element:<AppLayout/>,
      children  : [
      {
        path:"/",
        element:<Home />,
      },
      {
       path:"/marketplace",
       element:<Marketplace/>
      },
      {
       path:"/subscription",
       element:<Subscription/>
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
      }
      

    ]},
    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/register",
      element:<Register/>
    },
    {
      path:"/farmerdashboard",
      element:<FarmerDashboard/>
    }
  ]);

  return <RouterProvider router={router}/>
}