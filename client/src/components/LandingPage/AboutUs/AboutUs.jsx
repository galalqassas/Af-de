import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-us" id="about">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-1">
            <div className="accordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    What are the key features of our platform?
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                >
                  <div className="accordion-body">
                    Our platform offers personalized live sessions, hands-on
                    interactive courses, and a vibrant community to help
                    learners achieve their goals effectively.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    How do we ensure quality education?
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body">
                    We collaborate with expert instructors and integrate
                    advanced tools to create an engaging and effective learning
                    experience tailored to individual needs.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Why choose our platform over others?
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body">
                    Unlike traditional learning platforms, we prioritize
                    real-time interaction, practical projects, and community
                    support to make learning more effective and enjoyable.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    Do we offer support and guidance?
                  </button>
                </h2>
                <div
                  id="collapseFour"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body">
                    Absolutely! Our dedicated support team and vibrant learner
                    community are always here to assist you on your learning
                    journey.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 align-self-center">
            <div className="section-heading">
              <h6>About Us</h6>
              <h2>Why We’re the Best Platform for Learning?</h2>
              <p>
                Our mission is to revolutionize education by combining
                technology, expert guidance, and an interactive approach to
                empower learners and shape their future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
