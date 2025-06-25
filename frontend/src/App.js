import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Common Pages
import Home from "./component1/Home/Home";
import ErrorPage from "./pages/404Page/ErrorPage";

// Auth Pages
import Client_signup from "./component1/Signup/Client_signup";
import Client_login from "./component1/Login/Client_login";
import UserSignup from "./component1/Signup/UserSignup";
import Addhar from "./component1/Signup/UserSignup_components/Addhar";
import Userlogin from "./component1/Login/Userlogin";
import ForgotPassword from "./pages/ResetPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import SuperAdminLogin from "./pages/SuperAdmin/SuperAdminLogin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard/SuperAdminDashboard";

// Client Dashboard
import Dashboard from "./component1/Client_main/Dashboard";
import ClientDashboardPage from "./component1/Client_main/DashboardPage";
import ClientProfile from "./pages/Client/Profile/Profile";

// Establishment Dashboard
import Client_dashboard from "./component1/Client_dashboard/Client_dashboard";
import DashboardPage from "./component1/Client_dashboard/DashboardPage";
import ClientRegistration from "./component1/Client_dashboard/ClientRegistration";
import Subadmin from "./component1/Client_dashboard/Subadmin";
import SupervisorRegistration from "./component1/Client_dashboard/SupervisorRegistration";
import ClientForm from "./component1/Client_dashboard/ClientForm";
import SupervisorForm from "./component1/Client_dashboard/SupervisorForm";
import EstablishmentProfile from "./pages/Establishment/Profile/Profile";
import ClientDetail from "./component1/Client_dashboard/ClientDetail";
import SupervisorDetail from "./component1/Client_dashboard/SupervisorDetail";
import ClientHiring from "./component1/Client_dashboard/ClientHiring";
import PostHiringForm from "./component1/Client_dashboard/PostHiringForm";
import EmployeeDetail from "./pages/Establishment/EmployeeDetail/EmployeeDetail";
import RegisterCandidate from "./pages/Establishment/RegisterCandidate/RegisterCandidate";
import EstablishmentPanForm from "./pages/Establishment/PanForm/PanForm";
import EstablishmentAccountForm from "./pages/Establishment/AccountForm/AccountForm";
import AlotWages from "./pages/Establishment/AlotWages/AlotWages";
import EstablishmentPfEsic from "./pages/Establishment/PF ESIC/PendingPfEsic";
import ActiveUsers from "./pages/Establishment/ActiveUsers/ActiveUsers";
import LeaveManagement from "./pages/Establishment/Leave Management/LeaveManagement";
import AttendanceAnalysis from "./pages/Establishment/Attendance Analysis/AttandanceAnalysis";
import EmployeeAttendance from "./pages/Establishment/Attendance Analysis/EmployeeAttendance";
import AttendanceDashboard from "./components/Attendance Analysis/AttendenceDashboard";

// Supervisor Dashboard
import SupervisorDashboard from "./component1/Supervisor_dashboard/SupervisorDashboard";
import SupervisorDashboardPage from "./component1/Supervisor_dashboard/SupervisorDashboardPage";
import HiringList from "./component1/Supervisor_dashboard/HiringList";
import SupervisorAlotWages from "./pages/Supervisor/Alot Wages/AlotWages";
import SupervisorActiveUser from "./pages/Supervisor/ActiveUsers/ActiveUsers";
import AllotDateofJoining from "./pages/Supervisor/Allot Date of Joining/AllotDateofJoining";
import PendingPF_ESIC from "./pages/Supervisor/Pending PF_ESIC/PendingPF_ESIC";
import OfferLetter from "./pages/Supervisor/OfferLetter/OfferLetter";
import SendOfferLetter from "./pages/Supervisor/OfferLetter/SendOfferLetter";
import SupervisorProfile from "./pages/Supervisor/Profile/Profile";
import Users from "./pages/Supervisor/Users/Users";
import LeaveManagementSupervisor from "./pages/Supervisor/Leave Management/LeaveManagement";

// User Dashboard
import UserDashboard from "./component1/UserDashboard/UserDashboard";
import UserDashboardPage from "./component1/UserDashboard/UserDashboardPage";
import Jobs from "./component1/UserDashboard/Jobs";
import UserProfile from "./pages/User/UserProfile/UserProfile";
import PanForm from "./component1/UserDashboard/PanForm";
import AccountForm from "./component1/UserDashboard/AccountForm";
import UanEsicForm from "./component1/UserDashboard/UanEsicForm";
import UserOfferLetter from "./pages/User/OfferLetter/OfferLetter";
import ShowOfferLetter from "./pages/User/OfferLetter/ShowOfferLetter";
import UserLeaveManagement from "./pages/User/Leave Management/LeaveManagement";
import UserAttendencePage from "./pages/User/Attendence/Attendence";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home />, errorElement: <ErrorPage /> },
    { path: "/client-signup", element: <Client_signup /> },
    { path: "/client_login", element: <Client_login /> },
    {
      path: "/user-signup",
      element: <UserSignup />,
      children: [{ path: "/user-signup/", element: <Addhar /> }],
    },
    { path: "/user_login", element: <Userlogin /> },
    { path: "/superadmin-login", element: <SuperAdminLogin /> },
    { path: "/superadmin-dashboard", element: <SuperAdminDashboard /> },
    { path: "/reset-password", element: <ForgotPassword /> },
    { path: "/reset-password/:token", element: <ResetPassword /> },
    { path: "*", element: <ErrorPage /> },

    {
      path: "/establisment_dashboard",
      element: <Client_dashboard />,
      errorElement: <ErrorPage />,
      children: [
        { path: "", element: <DashboardPage /> },
        { path: "alot-wages", element: <AlotWages /> },
        { path: "pending-pf-esic", element: <EstablishmentPfEsic /> },
        { path: "active-users", element: <ActiveUsers /> },
        { path: "client_registration", element: <ClientRegistration /> },
        { path: "client_registration_form", element: <ClientForm /> },
        { path: "sub_admin", element: <Subadmin /> },
        {
          path: "supervisor_registration",
          element: <SupervisorRegistration />,
        },
        { path: "supervisor_registration_form", element: <SupervisorForm /> },
        { path: "establisment_profile", element: <EstablishmentProfile /> },
        { path: "client_detail", element: <ClientDetail /> },
        { path: "supervisor_detail", element: <SupervisorDetail /> },
        { path: "hiring", element: <ClientHiring /> },
        { path: "post_hiring", element: <PostHiringForm /> },
        { path: "employee-detail", element: <EmployeeDetail /> },
        { path: "register-candidate", element: <RegisterCandidate /> },
        { path: "add_pan", element: <EstablishmentPanForm /> },
        { path: "add_account", element: <EstablishmentAccountForm /> },
        { path: "leave-management", element: <LeaveManagement /> },
        {
          path: "attendance-analysis",
          element: <AttendanceDashboard />,
          children: [
            { path: "", element: <AttendanceAnalysis /> },
            { path: "employee/:id", element: <EmployeeAttendance /> },
          ],
        },
      ],
    },

    {
      path: "/client_dashboard",
      element: <Dashboard />,
      errorElement: <ErrorPage />,
      children: [
        { path: "", element: <ClientDashboardPage /> },
        { path: "profile", element: <ClientProfile /> },
      ],
    },

    {
      path: "/supervisor_dashboard",
      element: <SupervisorDashboard />,
      children: [
        { path: "", element: <SupervisorDashboardPage /> },
        { path: "allot-wages", element: <SupervisorAlotWages /> },
        { path: "hiring", element: <HiringList /> },
        { path: "active-employees", element: <SupervisorActiveUser /> },
        { path: "allot-date-of-joining", element: <AllotDateofJoining /> },
        { path: "pending-pf-esic", element: <PendingPF_ESIC /> },
        { path: "profile", element: <SupervisorProfile /> },
        { path: "offer-letter", element: <OfferLetter /> },
        { path: "send-offer-letter", element: <SendOfferLetter /> },
        { path: "employee-detail", element: <EmployeeDetail /> },
        { path: "users", element: <Users /> },
        { path: "leave-management", element: <LeaveManagementSupervisor /> },
      ],
    },

    {
      path: "/user_dashboard",
      element: <UserDashboard />,
      errorElement: <ErrorPage />,
      children: [
        { path: "", element: <Jobs /> },
        { path: "dashboard", element: <UserDashboardPage /> },
        { path: "user_profile", element: <UserProfile /> },
        { path: "add_pan", element: <PanForm /> },
        { path: "add_account", element: <AccountForm /> },
        { path: "add_uan_esic", element: <UanEsicForm /> },
        { path: "offer-letters", element: <UserOfferLetter /> },
        { path: "offer-letter/:id", element: <ShowOfferLetter /> },
        { path: "leave-management", element: <UserLeaveManagement /> },
        { path: "attendance", element: <UserAttendencePage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
