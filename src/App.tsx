import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { getPosts } from "./services";

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isAnswerEnabled, setIsAnswerEnabled] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const getAnswerLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      setIsAnswerEnabled(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handleAnswer = (index: number) => {
    if (isAnswerEnabled) {
      const updatedQuestions: Question[] = [...questions];
      updatedQuestions[currentQuestionIndex].answer = index;
      setQuestions(updatedQuestions);
      handleNext();
    }
  };

  useEffect(() => {
    getPosts().then((posts) => {
      const randomNumber = Math.random() * (posts.length - 10);
      const selectedPosts = posts.slice(randomNumber, randomNumber + 10);
      const selectedQuestions = selectedPosts.map((post, index) => {
        return {
          id: index,
          title: post.title,
          options: [post.body.substring(0, 5), post.body.substring(5, 10), post.body.substring(10, 15), post.body.substring(15, 20)],
        };
      });
      setQuestions(selectedQuestions);
    });
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      if (timeLeft === 20) {
        setIsAnswerEnabled(true);
      }

      return () => clearTimeout(timer);
    } else {
      handleNext();
    }
  }, [timeLeft]);

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
    });
  }, []);

  return (
    <div className="container">
      {questions.length > 0 ? (
        // pointerEvents and opacity are used to disable the quiz when it's finished
        <div className="quiz" style={{ pointerEvents: isQuizFinished ? "none" : "auto", opacity: isQuizFinished ? 0.5 : 1 }}>
          <div aria-busy={timeLeft < 10 && !isQuizFinished} className="timer">
            {isQuizFinished ? "Quiz Finished" : `Time left: ${timeLeft}s`}
          </div>
          <span className="question-index">Question {currentQuestionIndex + 1}</span>
          <span className="question-title">{questions[currentQuestionIndex].title}</span>
          <div className="options">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button className="option" key={index} onClick={() => handleAnswer(index)} disabled={!isAnswerEnabled}>
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
      {isQuizFinished && (
        <div className="results">
          <h1>Results</h1>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Option</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
              {questions?.map((question, index) => (
                <tr key={index}>
                  <td>
                    {index + 1} - {question?.title}
                  </td>
                  <td>
                    {getAnswerLetter(question?.answer!) !== null ? `${getAnswerLetter(question?.answer!)}` : ""}
                  </td>
                  <td>
                    {question?.answer !== undefined ? `${question?.options[question?.answer!]}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
