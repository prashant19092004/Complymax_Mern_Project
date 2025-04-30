import React from 'react'
import { TbReport, TbLicense } from "react-icons/tb";
import { TbReportAnalytics } from "react-icons/tb";
import { Link } from 'react-router-dom';

const SupervisorDashboardPage = () => {
  return (
    <div>
        <main className="py-6 bg-surface-secondary">
            <div className="container-fluid">
                {/* <!-- Card stats --> */}
                <div className="row g-6 mb-6">
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <Link to="/supervisor_dashboard/hiring">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Hire Candidate</span>
                                            {/* <span className="h3 font-bold mb-0">$750.90</span> */}
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape' >
                                                <i className="bi bi-credit-card"></i>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="mt-2 mb-0 text-sm">
                                        <span className="badge badge-pill bg-soft-success text-success me-2">
                                            <i className="bi bi-arrow-up me-1"></i>13%
                                        </span>
                                        <span className="text-nowrap text-xs text-muted">Since last month</span>
                                    </div> */}
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <Link to='/supervisor_dashboard/allot-date-of-joining'>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Allot Date of Joining</span>
                                            {/* <span className="h3 font-bold mb-0">215</span> */}
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                                <i className="bi bi-people"></i>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="mt-2 mb-0 text-sm">
                                        <span className="badge badge-pill bg-soft-success text-success me-2">
                                            <i className="bi bi-arrow-up me-1"></i>30%
                                        </span>
                                        <span className="text-nowrap text-xs text-muted">Since last month</span>
                                    </div> */}
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <Link to='/supervisor_dashboard/allot-wages'>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Allot Wages</span>
                                            {/* <span className="h3 font-bold mb-0">215</span> */}
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                                <i className="bi bi-people"></i>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="mt-2 mb-0 text-sm">
                                        <span className="badge badge-pill bg-soft-success text-success me-2">
                                            <i className="bi bi-arrow-up me-1"></i>30%
                                        </span>
                                        <span className="text-nowrap text-xs text-muted">Since last month</span>
                                    </div> */}
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <Link to="/supervisor_dashboard/pending-pf-esic">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Pending PF/ESIC</span>
                                            {/* <span className="h3 font-bold mb-0">1.400</span> */}
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                                <i className="bi bi-clock-history"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <Link to="/supervisor_dashboard/active-employees">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Active Employee Data</span>
                                            {/* <span className="h3 font-bold mb-0">95%</span> */}
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                            <i className="bi bi-file-earmark-person"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <Link to="/supervisor_dashboard/offer-letter">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Offer Letter</span>
                                            {/* <span className="h3 font-bold mb-0">95%</span> */}
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                            <i className="bi bi-file-earmark-person"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <Link to="/supervisor_dashboard/users">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Users</span>
                                            {/* <span className="h3 font-bold mb-0">95%</span> */}
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                            <i className="bi bi-file-earmark-person"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}

export default SupervisorDashboardPage