import React, { useEffect, useState } from "react";
import "./Feedback.css"; 

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/ratings")
      .then((response) => response.json()) 
      .then((data) => {
        if (Array.isArray(data)) {
          setFeedbacks(data); 
        } else {
          console.error("Invalid feedback data:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
      });
  }, []); 

  
  const nextFeedback = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length); 
  };

  const prevFeedback = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + feedbacks.length) % feedbacks.length
    ); 
  };


  return (
    <div className="testimonials">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            {feedbacks.length > 0 && (
              <div className="feedback-container">
                <div className="item">
                  <p>{`“${feedbacks[currentIndex].comment}”`}</p>
                  <div className="author">
                    <img
                      src={`https://ui-avatars.com/api/?name=${feedbacks[currentIndex].student_name}`} 
                      alt={feedbacks[currentIndex].student_name}
                    />
                    <span className="category">
                      {feedbacks[currentIndex].course_name}
                    </span>
                    <h4>{feedbacks[currentIndex].student_name}</h4>
                  </div>
                </div>
                <div className="owl-nav">
                  <button className="owl-prev" onClick={prevFeedback}>
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <button className="owl-next" onClick={nextFeedback}>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-5 align-self-center">
            <div className="section-heading">
              <h6>Feedback</h6>
              <h2>What our students say</h2>
              <p>
                Here are some of the feedback and ratings from our students on
                various courses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
