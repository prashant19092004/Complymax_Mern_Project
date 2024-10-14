import React from 'react'
import banner1 from '../../../assets/banner1.png';
import banner2 from '../../../assets/banner2.png';
import banner3 from '../../../assets/banner3.png';
import banner4 from '../../../assets/banner4.png';

const ComplymaxCarousal = () => {
  return (
    <div>
        <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  <div class="carousel-item active" data-bs-interval="2000">
                    <img src={banner1} class="d-block w-100" alt="..." />
                  </div>
                  <div class="carousel-item" data-bs-interval="2000">
                    <img src={banner2} class="d-block w-100" alt="..." />
                  </div>
                  <div class="carousel-item" data-bs-interval="2000">
                    <img src={banner3} class="d-block w-100" alt="..." />
                  </div>
                  <div class="carousel-item" data-bs-interval="2000">
                    <img src={banner4} class="d-block w-100" alt="..." />
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
    </div>
  )
}

export default ComplymaxCarousal