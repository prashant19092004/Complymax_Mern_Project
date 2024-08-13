import React from 'react'
import map from '../../../assets/map.svg';

const Presence = () => {
  return (
    <div>
        <div class="presence">
  <h1 class="team-heading" style={{marginBottom: '50px'}}>Our Presence</h1>
  <div class="team-box d-flex">
    <div class="team-box-img">
       
      <img src={map} alt='' />
    </div>
    <div class="team-box-content">
      <h1>In North</h1>
      <div class="feature-line"></div>
      <p>we are in Delhi NCR,
        Ludhiana, Chandigarh, Noida, Ghaziabad,
        Haridwar, Dehradun</p>
      <h1>In West</h1>
      <div class="feature-line"></div>
      <p>we are In Mumbai, Bhiwandi, Pargah ,Maknoli,
        Goregaon, Thane, Kalyan .</p>
      <h1>In East</h1>
      <div class="feature-line"></div>
      <p>we are in Dankuni, Calcutta Airport, Silliguri,
        Ranchi, Guwahati , Patna .</p>
    </div>
  </div>
 </div>
    </div>
  )
}

export default Presence