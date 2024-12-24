import Header from "../../components/LandingPage/LandingPageHeader/LandingPageHeader";
import CoursePageBody from "../../components/CoursePageBody/CoursePageBody";
import Footer from "../../components/LandingPage/Footer/Footer";

function CoursePage() {
  return (
    <div className="course-page" style={{ paddingTop: "65px" }}>
      <Header />
      <CoursePageBody />
      <Footer />
    </div>
  );
}

export default CoursePage;
