import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./FeedbackForm.css";

const FeedbackForm = () => {
    const { courseId } = useParams();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const studentId = sessionStorage.getItem("student_id"); 
            if (!studentId) {
                setErrorMessage("Student ID is missing. Please log in again.");
                return;
            }

            const response = await fetch("http://127.0.0.1:5000/submit-feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rated_by: studentId,
                    course_id: courseId,
                    rating,
                    feedback,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit feedback.");
            }

            const data = await response.json();
            setSuccessMessage("Feedback submitted successfully!");
            setFeedback("");
            setRating(0);
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    return (
        <div className="feedback-form-container">
            <h2>Submit Feedback</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="rating-container">
                    <label>Rate this course:</label>
                    <div className="rating">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <span
                                key={value}
                                className={`star ${value <= rating ? "selected" : ""}`}
                                onClick={() => handleRatingChange(value)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write your feedback here..."
                    required
                ></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
