import React from 'react'
import logo from '../../../assets/logo-full.png';

const Footer = () => {
  return (
    <div>
        <footer id="picassoFooter">
  <div class="footer-navigation">
      <h3>Quick Links</h3>
      <div class="footer-line"></div>
      <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#team">Our Team</a></li>
          <li><a href="#contact">Contact</a></li>
      </ul>
  </div>
  <div class="footer-contact">
      <h3>Contact Us</h3>
      <div class="footer-line"></div>
      <p><span style={{fontWeight: '500'}}>Email:</span> info@complymax.co.in</p>
      <p><span style={{fontWeight: '500'}}>Phone:</span> 01145642185</p>
      <p><span style={{fontWeight: '500'}}>Address:</span>  GF- 318 Pocket-A Lok Nayak Puram Bakkar Wala 110041</p>
      <p style={{marginTop: '15px', marginBottom: '5px', fontWeight: '500'}}>Follow Us:</p>
      <div class="social-icons">
          <a href="https://www.facebook.com/uridetour" target="_blank" class="social-icon"><img src="./assets//facebook.png" alt="" /></a>
          <a href="https://twitter.com/uridetour" target="_blank" class="social-icon"><img src="./assets//twitter.png" alt="" /></a>
          <a href="https://www.instagram.com/uridetour/" target="_blank" class="social-icon"><img src="./assets//instagram.png" alt="" /></a>
          <a href="https://www.linkedin.com/company/uridetour" target="_blank" class="social-icon"><img src="./assets//linkedin.png" alt="" /></a>
          
        </div>
  </div>
  <div class="footer-art">
      <img src={logo} alt="" />
      <p style={{marginTop: '10px',}}>ComplyMax Management Pvt. Ltd. is a leading provider of Payroll & compliance management , Manpower solutions catering to a diverse range of industries</p>
  </div>
</footer>
    </div>
  )
}

export default Footer