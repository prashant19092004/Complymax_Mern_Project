import React from 'react'
import { TbReport, TbLicense } from "react-icons/tb";
import { TbReportAnalytics } from "react-icons/tb";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div>
        <main className="py-6 bg-surface-secondary">
            <div className="container-fluid">
                {/* <!-- Card stats --> */}
                <div className="row g-6 mb-6">
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Candidate Registration</span>
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
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Alot Wages</span>
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
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card shadow border-0">
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
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Candidate Data</span>
                                        {/* <span className="h3 font-bold mb-0">95%</span> */}
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                        <i class="bi bi-file-earmark-person"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card shadow border-0">
                            <Link to="/establisment_dashboard/hiring">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Hiring</span>
                                            {/* <span className="h3 font-bold mb-0">95%</span> */}
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                                <i class="bi bi-person-plus"></i>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Report</span>
                                        {/* <span className="h3 font-bold mb-0">95%</span> */}
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                            <TbReportAnalytics />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Monthly Compilance</span>
                                        {/* <span className="h3 font-bold mb-0">95%</span> */}
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                            <TbReport />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">CLRA Licence</span>
                                        {/* <span className="h3 font-bold mb-0">95%</span> */}
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                            <TbLicense />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}

export default DashboardPage