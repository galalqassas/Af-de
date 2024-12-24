'use client';

import { useState } from 'react';
import './quiz.css'; // Ensure this is correctly linked

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const quizQuestions = [
    {
      question: 'What is agile?',
      options: ['Framework', 'Tool', 'Language', 'Compiler'],
      answer: 0,
    },
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      answer: 1,
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      answer: 1,
    },
  ];

  const handleAnswer = (index) => {
    if (index === quizQuestions[currentQuestion].answer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="quizContainer">
      {!quizStarted ? (
        <div className="startContainer">
          <button className="button" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      ) : quizComplete ? (
        <div className="resultContainer">
          <h1>Your Score: {score} / {quizQuestions.length}</h1>
          <p>{score === quizQuestions.length ? 'Excellent work!' : 'Good job, but you can do better!'}</p>
          <button className="button" onClick={restartQuiz}>Retry Quiz</button>
          <button className="button" onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button>
        </div>
      ) : (
        <div className="questionContainer">
          <h1>{quizQuestions[currentQuestion].question}</h1>
          <div className="optionsContainer">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className="optionButton"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
