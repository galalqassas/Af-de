import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import "./LandingPageCourses.css";

function Courses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/LandingPageCourses")
            .then((response) => response.json())
            .then((data) => {
                setCourses(data);
            })
            .catch((error) => console.error("Error fetching courses:", error));
    }, []);

    return (
        <section className="courses" id="courses"> 
            <div className="container">
                <div className="section-heading">
                    <h2>Courses</h2>
                </div>
                <div className="row">
                    {courses.map((course) => (
                        <div className="col-lg-4 col-md-6 course-card" key={course.course_id}>
                            <div className="events_item">
                                <Link to={`/course/${course.course_id}`}>
                                    <div className="thumb">
                                        <img src={`../../assets/${course.image_url}`} alt={course.course_name} />
                                        <span className="category">{course.course_name.toUpperCase()}</span>
                                        <span className="price">
                                            <h6>${course.price}</h6>
                                        </span>
                                    </div>
                                </Link>

                                {/* Keep course description outside the Link */}
                                <div className="down-content">
                                    <h4>{course.course_name}</h4>
                                    <p>{course.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Courses;
