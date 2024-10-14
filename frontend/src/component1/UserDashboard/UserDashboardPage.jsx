import React from 'react'
import { TbReport, TbLicense } from "react-icons/tb";
import { TbReportAnalytics } from "react-icons/tb";

const UserDashboardPage = () => {
  return (
    <div>
        <main className="py-6 bg-surface-secondary">
            <div className="container-fluid">
                {/* <!-- Card stats --> */}
                <div className="row g-6 mb-6 gy-6">
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Offer Letter</span>
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
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Appointment Letter</span>
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
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">PF/ESIC</span>
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
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Salary Slip</span>
                                        {/* <span className="h3 font-bold mb-0">95%</span> */}
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                        <i className="bi bi-file-earmark-person"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Job History</span>
                                        {/* <span className="h3 font-bold mb-0">95%</span> */}
                                    </div>
                                    <div className="col-auto">
                                        <div className="icon icon-shape text-white text-lg rounded-circle" id='icon_shape'>
                                            <i className="bi bi-person-plus"></i>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12 py-3">
                        <div className="card shadow border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h6 font-semibold text-muted text-sm d-block mb-2">Experience Letter</span>
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
                </div>
            </div>
        </main>
    </div>
  )
}

export default UserDashboardPage