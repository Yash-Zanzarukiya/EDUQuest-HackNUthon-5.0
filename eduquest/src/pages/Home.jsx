import React, { Fragment } from "react";
import HeroSection from "../components/Hero-Section/HeroSection";


import AboutUs from "../components/About-us/AboutUs";
import Courses from "../components/Courses-section/Courses";
import ChooseUs from "../components/Choose-us/ChooseUs";
import Features from "../components/Feature-section/Features";

import Testimonials from "../components/Testimonial/Testimonials";

import Newsletter from "../components/Newsletter/Newsletter";
import Footer from "../components/Footer/Footer";

const Home = ({data}) => {
  return (
    <Fragment>

      <HeroSection />

      <AboutUs />
      <Courses data={data}/>
      <ChooseUs />
      <Features />
      <Testimonials />
      <Newsletter />
      <Footer />
    </Fragment>
  );
};

export default Home;
