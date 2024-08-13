import React from 'react'
import privacy from '../../../assets/privacy.png';
import dashboard1 from '../../../assets/dashboard1.png';
import workflow from '../../../assets/workflow.png';
import file from '../../../assets/file.png';
import support from '../../../assets/customersupport.png';
import inter_face from '../../../assets/interface.png';

const Features = () => {
  return (
    <div>
        <div class="content-side">
    <h2 style={{fontWeight: '500', color: '#009933', fontStyle: 'italic', textAlign: 'center', paddingTop: '70px',}}>Features of Our Software
    </h2>
    <div class="inner-main-box">
        <div class="boxes box-1">
            <div class="feature-box-img">
              <img src={dashboard1} alt="" />
            </div>
            <h4>Centralized Dashboard</h4>
            <div class="feature-line"></div>
            <p class="text-cont">Access all compliance tasks from a single, intuitive dashboard.</p>
            

        </div>
        <div class="boxes box-1">
          <div class="feature-box-img">
            <img src={workflow} alt="" />
          </div>
          <h4>Customizable Workflows</h4>
          <div class="feature-line"></div>
          <p class="text-cont">
            Tailor workflows for seamless compliance management.</p>
          

      </div>
      <div class="boxes box-1">
        <div class="feature-box-img">
          <img src={file} alt="" />
        </div>
        <h4>Document Management</h4>
        <div class="feature-line"></div>
        <p class="text-cont">Easily manage compliance documents for accessibility and version control.</p>
        

    </div>
    <div class="boxes box-1">
      <div class="feature-box-img">
        <img src={support} alt="" />
      </div>
      <h4>24/7 Customer Support</h4>
      <div class="feature-line"></div>
      <p class="text-cont">Offer 24/7 customer support for all inquiries.</p>
      

  </div>
  <div class="boxes box-1">
    <div class="feature-box-img">
      <img src={inter_face} alt="" />
    </div>
    <h4>User-Friendly Interface</h4>
    <div class="feature-line"></div>
    <p class="text-cont">Design intuitive interface for easy navigation and task completion.</p>
    

</div>
<div class="boxes box-1">
  <div class="feature-box-img">
    <img src={privacy} alt="" />
  </div>
  <h4>Data Security and Privacy</h4>
  <div class="feature-line"></div>
  <p class="text-cont">Ensure data security with encryption and privacy protocols.</p>
  

</div>
    </div>
</div>
    </div>
  )
}

export default Features