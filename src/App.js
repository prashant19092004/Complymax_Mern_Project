import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './component1/Home/Home';
import Client_signup from './component1/Signup/Client_signup';
import Client_login from './component1/Login/Client_login';
import Client_dashboard from './component1/Client_dashboard/Client_dashboard';
import UserSignup from './component1/Signup/UserSignup';
import Addhar from './component1/Signup/UserSignup_components/Addhar';
import ShowAadharData from './component1/Signup/UserSignup_components/ShowAadharData';
import Userlogin from './component1/Login/Userlogin';
import UserDashboard from './component1/UserDashboard/UserDashboard';
import DashboardPage from './component1/Client_dashboard/DashboardPage';
import ClientRegistration from './component1/Client_dashboard/ClientRegistration';
import Subadmin from './component1/Client_dashboard/Subadmin';
import SupervisorRegistration from './component1/Client_dashboard/SupervisorRegistration';
import ClientForm from './component1/Client_dashboard/ClientForm';
import SupervisorForm from './component1/Client_dashboard/SupervisorForm';
import Dashboard from './component1/Client_main/Dashboard';
import SupervisorDashboard from './component1/Supervisor_dashboard/SupervisorDashboard';
import UserDashboardPage from './component1/UserDashboard/UserDashboardPage';
import SupervisorDashboardPage from './component1/Supervisor_dashboard/SupervisorDashboardPage';
import EstablismentProfile from './component1/Client_dashboard/EstablismentProfile';
import UserProfile from './component1/UserDashboard/UserProfile';
import PanForm from './component1/UserDashboard/PanForm';
import AccountForm from './component1/UserDashboard/AccountForm';
import ClientDetail from './component1/Client_dashboard/ClientDetail';
import SupervisorDetail from './component1/Client_dashboard/SupervisorDetail';
import Jobs from './component1/UserDashboard/Jobs';
import ClientHiring from './component1/Client_dashboard/ClientHiring';
import PostHiringForm from './component1/Client_dashboard/PostHiringForm';
import HiringList from './component1/Supervisor_dashboard/HiringList';
function App() {

   
    const router= createBrowserRouter([
          {
            path: "/",
            element: <Home />,
          },
          {
            path:"/client-signup",
            element:<Client_signup />,    
          },
          {
            path:"/client_login",
            element:<Client_login />
          },
          {
            path : "/establisment_dashboard",
            element : <Client_dashboard />,
            children : [
              {
                path : "/establisment_dashboard/",
                element : <DashboardPage />
              },
              {
                path : "/establisment_dashboard/client_registration",
                element : <ClientRegistration />
              },
              {
                path : "/establisment_dashboard/client_registration_form",
                element : <ClientForm />
              },
              {
                path : '/establisment_dashboard/sub_admin',
                element : <Subadmin />
              },
              {
                path : '/establisment_dashboard/supervisor_registration',
                element : <SupervisorRegistration />
              },
              {
                path : "/establisment_dashboard/supervisor_registration_form",
                element : <SupervisorForm />
              },
              {
                path : "/establisment_dashboard/establisment_profile",
                element : <EstablismentProfile />
              },
              {
                path:"/establisment_dashboard/client_detail",
                element : <ClientDetail />
              },
              {
                path:"/establisment_dashboard/supervisor_detail",
                element : <SupervisorDetail />
              },
              {
                path:"/establisment_dashboard/hiring",
                element : <ClientHiring />
              },
              {
                path:"/establisment_dashboard/post_hiring",
                element : <PostHiringForm />
              }
            ]
          },
          {
            path : "/client_dashboard",
            element : <Dashboard />,
            children : [
              {
                path : '/client_dashboard/',
                element : <DashboardPage />
              }
            ]
          },
          {
            path : "/supervisor_dashboard",
            element : <SupervisorDashboard />,
            children : [
              {
                path : '/supervisor_dashboard/',
                element : <SupervisorDashboardPage />
              },
              {
                path : '/supervisor_dashboard/hiring',
                element : <HiringList />
              }
            ]
          },
          {
            path : "/user-signup",
            element : <UserSignup />,
            children: [
              {
                path : "/user-signup/",
                element : <Addhar />
              }
            ]
          },
          {
            path:"/user_login",
            element:<Userlogin />
          },
          {
            path : "/user_dashboard",
            element : <UserDashboard />,
            children : [
              {
                path : "/user_dashboard/dashboard",
                element : <UserDashboardPage />
              },
              {
                path : "/user_dashboard/",
                element : <Jobs />
              },
              {
                path : "/user_dashboard/user_profile",
                element : <UserProfile />
              },
              {
                path : "/user_dashboard/add_pan",
                element : <PanForm />
              },
              {
                path : "/user_dashboard/add_account",
                element : <AccountForm />
              }
            ]
          }
    ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
