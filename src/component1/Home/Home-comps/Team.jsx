import React from 'react'
import team_pic1 from '../../../assets/team-pic1.jpg';
import team_pic2 from '../../../assets/team-pic2.jpg';

const Team = () => {
  return (
    <div>
        <section id="team" class="team-section">
  <h1 class="team-heading" style={{marginBottom: '50px'}}>Our Team</h1>
  <div class="team">
    <div class="team-box d-flex">
      <div class="team-box-img">
        <img src={team_pic1} alt="" />
      </div>
      <div class="team-box-content">
        <h1>Experienced Professionals</h1>
        <div class="feature-line"></div>
        <p>Our team
          comprises compliance experts,
          software developers, and consultants
          dedicated to delivering top-notch
          solutions and services.</p>
      </div>
    </div>
    <div class="team-box d-flex" style={{flexDirection: 'row-reverse'}}>
      <div class="team-box-img">
        <img src={team_pic2} alt="" />
      </div>
      <div class="team-box-content">
        <h1>Commitment to Excellence</h1>
        <div class="feature-line"></div>
        <p>We are
          committed to staying abreast of
          regulatory changes and technological
          advancements to continually enhance
          our offerings.</p>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Team