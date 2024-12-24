import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./quizCreation.css";

const quizCreation = () => {
    const navigate = useNavigate();

    const initialQuizData = {
        title: "",
        course_id: "",
        max_score: "",
        post_date: "",
        deadline: "",
        question: "",
        options: {
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
        },
        answer: "",
    };

    const [quizData, setQuizData] = useState(initialQuizData);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("option_")) {
            setQuizData({
                ...quizData,
                options: { ...quizData.options, [name]: value },
            });
        } else {
            setQuizData({ ...quizData, [name]: value });
        }
    };

    const validateFormData = async () => {
        const today = new Date().toISOString().split("T")[0];

        if (quizData.course_id <= 0) {
            throw new Error("Course ID must be a positive number.");
        }

        if (quizData.post_date < today || quizData.deadline < today) {
            throw new Error("Post Date and Deadline cannot be in the past.");
        }

        if (quizData.post_date > quizData.deadline) {
            throw new Error("Post Date cannot be after Deadline.");
        }

        const response = await fetch(
            `http://127.0.0.1:5000/course/validate/${quizData.course_id}`
        );
        if (!response.ok) {
            throw new Error("Course ID is invalid. Please enter a valid course ID.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await validateFormData();

            const payload = {
                ...quizData,
                ...quizData.options,
            };

            const response = await fetch("http://127.0.0.1:5000/quiz/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to create quiz");

            const result = await response.json();
            setSuccess(result.message);
            setQuizData(initialQuizData); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="quiz-creation-container">
            <header className="quiz-creation-header">
                <h1>Quiz Creation</h1>
                <button
                    className="dashboard-button"
                    onClick={() => navigate("/teacher-dashboard")}
                >
                    Return to Dashboard
                </button>
            </header>

            <form onSubmit={handleSubmit} className="quiz-creation-form">
                <div className="form-section">
                    <label>Title:</label>
                    <input type="text" name="title" value={quizData.title} onChange={handleChange} required />

                    <label>Course ID:</label>
                    <input type="number" name="course_id" value={quizData.course_id} onChange={handleChange} required />

                    <label>Max Score:</label>
                    <input type="number" name="max_score" value={quizData.max_score} onChange={handleChange} required />

                    <label>Post Date:</label>
                    <input type="date" name="post_date" value={quizData.post_date} onChange={handleChange} required />

                    <label>Deadline:</label>
                    <input type="date" name="deadline" value={quizData.deadline} onChange={handleChange} required />
                </div>

                <div className="form-section">
                    <label>Question:</label>
                    <input type="text" name="question" value={quizData.question} onChange={handleChange} required />

                    <label>Options:</label>
                    <input type="text" name="option_a" placeholder="Option A" value={quizData.options.option_a} onChange={handleChange} required />
                    <input type="text" name="option_b" placeholder="Option B" value={quizData.options.option_b} onChange={handleChange} required />
                    <input type="text" name="option_c" placeholder="Option C" value={quizData.options.option_c} onChange={handleChange} required />
                    <input type="text" name="option_d" placeholder="Option D" value={quizData.options.option_d} onChange={handleChange} required />

                    <label>Correct Answer:</label>
                    <select name="answer" value={quizData.answer} onChange={handleChange} required>
                        <option value="">Select Correct Answer</option>
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">Create Quiz</button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default quizCreation;
