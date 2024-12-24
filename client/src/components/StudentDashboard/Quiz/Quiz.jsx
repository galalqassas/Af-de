import React, { useState, useEffect } from "react";
import "./Quiz.css";

const Quiz = ({ courseId }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!courseId) {
            setError("Course ID is missing. Please select a course.");
            return;
        }

        const fetchQuizQuestions = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/quiz/get-quiz?course_id=${courseId}`);
                if (!response.ok) throw new Error("Failed to fetch quiz questions");
                const data = await response.json();
                if (data.error) throw new Error(data.error);

                setQuestions(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchQuizQuestions();
    }, [courseId]);

    const handleOptionSelect = (optionKey) => {
        setAnswers({
            ...answers,
            [questions[currentQuestionIndex].quiz_id]: optionKey,
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        const studentId = sessionStorage.getItem("student_id");
        if (!studentId) {
            setError("Student ID is missing. Please log in again.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/quiz/submit-quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: studentId,
                    course_id: courseId,
                    answers: answers,
                }),
            });

            if (!response.ok) throw new Error("Failed to submit quiz");
            const data = await response.json();
            setScore(data.score);
            setIsCompleted(true);
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) return <p className="error-message">{error}</p>;

    if (isCompleted) {
        return (
            <div className="quiz-container">
                <h2 className="quiz-title">Quiz Completed</h2>
                <p className="score-text">Your Score: {score}%</p>
            </div>
        );
    }

    if (questions.length === 0) return <p>Loading quiz questions...</p>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <h2 className="quiz-title">Quiz Assessment</h2>
            <div className="question-container">
                <p className="question-text">{currentQuestion.question}</p>
                <div className="options-container">
                    {["option_a", "option_b", "option_c", "option_d"].map((key) => (
                        <div
                            key={key}
                            className={`option ${
                                answers[currentQuestion.quiz_id] === key ? "selected" : ""
                            }`}
                            onClick={() => handleOptionSelect(key)}
                        >
                            {currentQuestion[key]}
                        </div>
                    ))}
                </div>
            </div>
            <button className="submit-button" onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </button>
        </div>
    );
};

export default Quiz;
