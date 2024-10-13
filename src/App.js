import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './component1/Home/Home';
import Client_signup from './component1/Signup/Client_signup';
import Client_login from './component1/Login/Client_login';
import Client_dashboard from './component1/Client_dashboard/Client_dashboard';
import UserSignup from './component1/Signup/UserSignup';
import Addhar from './component1/Signup/UserSignup_components/Addhar';
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
import ForgotPassword from './pages/ResetPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import AllotDateofJoining from './pages/Supervisor/Allot Date of Joining/AllotDateofJoining';
import PendingPF_ESIC from './pages/Supervisor/Pending PF_ESIC/PendingPF_ESIC';
import SuperAdminLogin from './pages/SuperAdmin/SuperAdminLogin/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard/SuperAdminDashboard';
import AlotWages from './pages/Establishment/AlotWages/AlotWages';
import SupervisorAlotWages from './pages/Supervisor/Alot Wages/AlotWages';
import EstablishmentPfEsic from './pages/Establishment/PF ESIC/PendingPfEsic';
import ActiveUsers from './pages/Establishment/ActiveUsers/ActiveUsers';
import SupervisorActiveUser from './pages/Supervisor/ActiveUsers/ActiveUsers';
import EmployeeDetail from './pages/Establishment/EmployeeDetail/EmployeeDetail';
import RegisterCandidate from './pages/Establishment/RegisterCandidate/RegisterCandidate';
import ErrorPage from './pages/404Page/ErrorPage';
import Profile from './pages/Supervisor/Profile/Profile';
import ClientProfile from './pages/Client/Profile/Profile';
import ClientDashboardPage from './component1/Client_main/DashboardPage';
import EstablishmentPanForm from './pages/Establishment/PanForm/PanForm';
import EstablishmentAccountForm from './pages/Establishment/AccountForm/AccountForm';

function App() {

   
    const router= createBrowserRouter([
          {
            path: "/",
            element: <Home />,
            errorElement : <ErrorPage />
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
            path : "/superadmin-login",
            element : <SuperAdminLogin />
          },
          {
            path : "/superadmin-dashboard",
            element : <SuperAdminDashboard />
          },
          {
            path: "*", // This handles 404s
            element: <ErrorPage />,
          },
          {
            path : "/establisment_dashboard",
            element : <Client_dashboard />,
            errorElement : <ErrorPage />,
            children : [
              {
                path : "/establisment_dashboard/",
                element : <DashboardPage />
              },
              {
                path : "/establisment_dashboard/alot-wages",
                element : <AlotWages />
              },
              {
                path : "/establisment_dashboard/pending-pf-esic",
                element : <EstablishmentPfEsic />
              },
              {
                path : "/establisment_dashboard/active-users",
                element : <ActiveUsers />
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
              },
              {
                path : "/establisment_dashboard/employee-detail",
                element : <EmployeeDetail />
              },
              {
                path : "/establisment_dashboard/register-candidate",
                element : <RegisterCandidate />
              },
              {
                path : '/establisment_dashboard/add_pan',
                element : <EstablishmentPanForm />
              },
              {
                path : '/establisment_dashboard/add_account',
                element : <EstablishmentAccountForm />
              }
            ]
          },
          {
            path : "/client_dashboard",
            element : <Dashboard />,
            errorElement : <ErrorPage />,
            children : [
              {
                path : '/client_dashboard/',
                element : <ClientDashboardPage />
              },
              {
                path : '/client_dashboard/profile',
                element : <ClientProfile />
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
                path : '/supervisor_dashboard/allot-wages',
                element : <SupervisorAlotWages />
              },
              {
                path : '/supervisor_dashboard/hiring',
                element : <HiringList />
              },
              {
                path : '/supervisor_dashboard/active-employees',
                element : <SupervisorActiveUser />
              },
              {
                path : '/supervisor_dashboard/allot-date-of-joining',
                element : <AllotDateofJoining />
              },
              {
                path : '/supervisor_dashboard/pending-pf-esic',
                element : <PendingPF_ESIC />
              },
              {
                path : '/supervisor_dashboard/profile',
                element : <Profile />
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
            errorElement : <ErrorPage />,
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
          },
          {
            path : '/reset-password',
            element : <ForgotPassword />
          },
          {
            path : '/reset-password/:token',
            element : <ResetPassword />
          }
    ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
