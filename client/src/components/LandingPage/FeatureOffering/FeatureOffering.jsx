import React from "react";
import "./FeatureOffering.css";

const features = [
    {
        icon: "fa-book",
        title: "Live Sessions",
        description: "Attend live sessions to interact with instructors and peers in real-time."
    },
    {
        icon: "fa-laptop-code",
        title: "Interactive Courses",
        description: "Engage with hands-on projects and assessments tailored for your learning goals."
    },
    {
        icon: "fa-users",
        title: "Community Support",
        description: "Collaborate and get assistance from a vibrant community of learners."
    }
];

function FeatureOffering() {
    return (
        <section className="feature-offerings">
            {features.map((feature) => (
                <div className="feature-card" key={feature.id}>
                    <div className="icon">
                        <i className={`fa ${feature.icon}`} />
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                </div>
            ))}
        </section>
    );
}

export default FeatureOffering;
