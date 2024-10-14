import React from 'react'
import ComplymaxNavbar from './Home-comps/ComplymaxNavbar'
import ComplymaxCarousal from './Home-comps/ComplymaxCarousal'
import Features from './Home-comps/Features'
import Services from './Home-comps/Services'
import Team from './Home-comps/Team'
import Banner from './Home-comps/Banner'
import Presence from './Home-comps/Presence'
import Review from './Home-comps/Review'
import Footer from './Home-comps/Footer'
import SubFooter from './Home-comps/SubFooter'


const Home = () => {
  return (
    <div>
        <ComplymaxNavbar />
        <ComplymaxCarousal />
        <Features />
        <Services />
        <Team />
        <Banner />
        <Presence />
        <Review />
        <Footer />
        <SubFooter />
    </div>
    
  )
}

export default Home