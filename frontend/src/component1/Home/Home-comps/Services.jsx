import React from 'react'
import check from '../../../assets/check.png';

const Services = () => {
  return (
    <div>
        <section id="services" class="eighth-section third-section flex ani8">
  <h2 class="services-heading">Our Services</h2>
  <div class="eighth-lists">
      <div class="first">
          <div class="content">
              <ul>
                  <li><img src={check} alt="" />CONTRACTUAL
                    STAFFING</li>
                  <li><img src={check} alt="" />MANPOWER
                    OUTSORCING</li>
                  <li><img src={check} alt="" />MIGRANT
                    MANPOWER</li>
                  <li><img src={check} alt="" />NAPS
                    MANPOWER</li>
                  <li><img src={check} alt="" />UNSKILED
                    MANPOWER</li>
              </ul>
          </div>
      </div>
      <div class="first">
          <div class="content">
              <ul>
                  <li><img src={check} alt="" />ADHOC
                    MANPOWER</li>
                  <li><img src={check} alt="" />PAYROLL
                    MANGMENT</li>
                  <li><img src={check} alt="" />CLRA LICENCE</li>
                  <li><img src={check} alt="" />STATUTORY
                    COMPLIANCE
                    SERVICES</li>
                  <li><img src={check} alt="" />ACCOUNTS
                    SECVICES</li>
              </ul>
          </div>
      </div>
      <div class="first">
          <div class="content">
              <ul>
                  <li><img src={check} alt="" />GST RETURNS /
                    REGITRATION</li>
                  <li><img src={check} alt="" />CLRA AUDIT</li>
                  <li><img src={check} alt="" />ESIC AND EPF</li>
                  <li><img src={check} alt="" />CLRA
                    CONSULTANCY
                    SERVICES</li>
                  <li><img src={check} alt="" />S&D CONSULTA
                    NCY SERVICES</li>
              </ul>
          </div>
      </div>
  </div>
</section>
    </div>
  )
}

export default Services