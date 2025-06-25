import React from 'react';
import { Link } from 'react-router-dom';
import { TbReportAnalytics } from "react-icons/tb";
import DashboardCard from '../../components/DashboardCard/DashboardCard';

const UserDashboardPage = () => {
  const cards = [
    {
      title: 'Offer Letter',
      icon: <i className="bi bi-credit-card"></i>,
      link: '/user_dashboard/offer-letters'
    },
    {
      title: 'Appointment Letter',
      icon: <i className="bi bi-people"></i>
    },
    {
      title: 'PF/ESIC',
      icon: <i className="bi bi-clock-history"></i>
    },
    {
      title: 'Salary Slip',
      icon: <i className="bi bi-file-earmark-person"></i>
    },
    {
      title: 'Job History',
      icon: <i className="bi bi-person-plus"></i>
    },
    {
      title: 'Experience Letter',
      icon: <TbReportAnalytics />
    },
    {
      title: 'Mark Attendance',
      icon: <i className="bi bi-people"></i>,
      link: '/user_dashboard/attendance'
    },
    {
      title: 'Leave Application',
      icon: <i className="bi bi-people"></i>,
      link: '/user_dashboard/leave-management'
    }
  ];

  return (
    <main className="py-6 bg-surface-secondary">
      <div className="container-fluid">
        <div className="row g-6 mb-6 gy-6">
          {cards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default UserDashboardPage;
