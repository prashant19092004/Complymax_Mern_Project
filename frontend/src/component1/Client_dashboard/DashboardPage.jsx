import React from 'react';
import { TbReport, TbLicense, TbReportAnalytics } from "react-icons/tb";
import { Link } from "react-router-dom";
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import {
  BsCreditCard,
  BsPeople,
  BsClockHistory,
  BsFileEarmarkPerson,
  BsPersonPlus
} from "react-icons/bs";

const cards = [
  { title: "Candidate Registration", icon: <BsCreditCard />, link: "/establisment_dashboard/register-candidate" },
  { title: "Alot Wages", icon: <BsPeople />, link: "/establisment_dashboard/alot-wages" },
  { title: "Pending PF/ESIC", icon: <BsClockHistory />, link: "/establisment_dashboard/pending-pf-esic" },
  { title: "Active Candidates", icon: <BsFileEarmarkPerson />, link: "/establisment_dashboard/active-users" },
  { title: "Hiring", icon: <BsPersonPlus />, link: "/establisment_dashboard/hiring" },
  { title: "Report", icon: <TbReportAnalytics /> },
  { title: "Monthly Compilance", icon: <TbReport /> },
  { title: "CLRA Licence", icon: <TbLicense /> },
  { title: "Leave Management", icon: <BsPeople />, link: "/establisment_dashboard/leave-management" },
  { title: "Attendance Management", icon: <BsPeople />, link: "/establisment_dashboard/attendance-analysis" },
  { title: "Holiday Management", icon: <BsPeople />, link: "/establisment_dashboard/holiday-management" },
];

const DashboardPage = () => {
  return (
    <main className="py-6 bg-surface-secondary">
      <div className="container-fluid">
        <div className="row g-6 mb-6">
          {cards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
