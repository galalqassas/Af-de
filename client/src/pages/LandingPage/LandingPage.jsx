import React from "react";
import LandingPageHeader from "../../components/LandingPage/LandingPageHeader/LandingPageHeader.jsx";
import MainBanner from "../../components/LandingPage/MainBanner/MainBanner";
import FeatureOffering from "../../components/LandingPage/FeatureOffering/FeatureOffering";
import AboutUs from "../../components/LandingPage/AboutUs/AboutUs";
import LandingPageCourses from "../../components/LandingPage/LandingPageCourses/LandingPageCourses";
import DisplayTeachers from "../../components/LandingPage/DisplayTeachers/DisplayTeachers";
import Feedback from "../../components/LandingPage/Feedback/Feedback";
import Footer from "../../components/LandingPage/Footer/Footer";

function LandingPage() {
  return (
    <div className="landing-page">
      <LandingPageHeader />
      <MainBanner />
      <FeatureOffering />
      <AboutUs  />
      <LandingPageCourses />
      <DisplayTeachers />
      <Feedback />
      <Footer />
    </div>
  );
}

export default LandingPage;
