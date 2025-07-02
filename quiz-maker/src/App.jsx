// App.jsx – Online Quiz Maker (All-in-One File)
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

// Home Component
const Home = () => (
  <div className="p-6 text-center">
    <h1 className="text-3xl font-bold mb-4">🎉 Welcome to Online Quiz Maker!</h1>
    <p className="mb-6">Create quizzes or test your knowledge instantly!</p>
    <div className="space-x-4">
      <Link to="/create" className="px-4 py-2 bg-blue-600 text-white rounded">Create Quiz</Link>
      <Link to="/quizzes" className="px-4 py-2 bg-green-600 text-white rounded">Take Quiz</Link>
    </div>
  </div>
);

// QuizForm Component
const QuizForm = ({ quizzes, setQuizzes }) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const navigate = useNavigate();

  const addQuestion = () => {
    if (!questionText.trim()) return;
    setQuestions([...questions, { question: questionText, options, answer: correctIndex }]);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
  };

  const saveQuiz = () => {
    if (!title.trim() || questions.length === 0) return;
    setQuizzes([...quizzes, { title, questions }]);
    navigate("/");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">📋 Create a New Quiz</h2>
      <input className="border p-2 w-full mb-4" value={title} onChange={e => setTitle(e.target.value)} placeholder="Quiz Title" />
      <input className="border p-2 w-full mb-2" value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Enter Question" />
      {options.map((opt, idx) => (
        <input key={idx} className="border p-2 w-full mb-2" value={opt} onChange={e => {
          const newOptions = [...options];
          newOptions[idx] = e.target.value;
          setOptions(newOptions);
        }} placeholder={`Option ${idx + 1}`} />
      ))}
      <select className="border p-2 w-full mb-4" value={correctIndex} onChange={e => setCorrectIndex(Number(e.target.value))}>
        {options.map((_, idx) => <option key={idx} value={idx}>Correct Option: {idx + 1}</option>)}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 mr-2 rounded" onClick={addQuestion}>Add Question</button>
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={saveQuiz}>Save Quiz</button>
    </div>
  );
};

// QuizList Component
const QuizList = ({ quizzes }) => (
  <div className="p-6 max-w-xl mx-auto">
    <h2 className="text-2xl font-semibold mb-4">📚 Available Quizzes</h2>
    {quizzes.length === 0 ? <p>No quizzes available.</p> : (
      quizzes.map((quiz, idx) => (
        <Link key={idx} to={`/quiz/${idx}`} className="block p-3 bg-gray-100 rounded mb-2 hover:bg-gray-200">
          {quiz.title}
        </Link>
      ))
    )}
  </div>
);

// TakeQuiz Component
const TakeQuiz = ({ quizzes }) => {
  const { quizId } = useParams();
  const quiz = quizzes[quizId];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const answerQuestion = (i) => {
    if (quiz.questions[current].answer === i) setScore(score + 1);
    setAnswers([...answers, i]);
    if (current + 1 < quiz.questions.length) setCurrent(current + 1);
    else setFinished(true);
  };

  if (!quiz) return <div className="p-6">❌ Quiz not found.</div>;

  if (finished) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">🎯 Your Score: {score} / {quiz.questions.length}</h2>
        {quiz.questions.map((q, i) => (
          <div key={i} className="mb-3">
            <p><strong>Q{i + 1}: {q.question}</strong></p>
            <p>Your Answer: {q.options[answers[i]]}</p>
            <p>Correct Answer: {q.options[q.answer]}</p>
          </div>
        ))}
      </div>
    );
  }

  const q = quiz.questions[current];
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{quiz.title}</h2>
      <p className="mb-3">Q{current + 1}: {q.question}</p>
      {q.options.map((opt, i) => (
        <button key={i} onClick={() => answerQuestion(i)} className="block w-full mb-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          {opt}
        </button>
      ))}
    </div>
  );
};

// App Component
const App = () => {
  const [quizzes, setQuizzes] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<QuizForm quizzes={quizzes} setQuizzes={setQuizzes} />} />
        <Route path="/quizzes" element={<QuizList quizzes={quizzes} />} />
        <Route path="/quiz/:quizId" element={<TakeQuiz quizzes={quizzes} />} />
      </Routes>
    </Router>
  );
};

export default App;
