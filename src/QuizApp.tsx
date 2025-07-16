// File: src/QuizApp.tsx

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: string;
};

const DEFAULT_ENROLL = "2500491234";

export default function QuizApp() {
  const [step, setStep] = useState<"welcome" | "quiz" | "result">("welcome");
  const [name, setName] = useState("");
  const [enroll, setEnroll] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins

  useEffect(() => {
    fetch("/questions.json")
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  useEffect(() => {
    if (step === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
    if (step === "quiz" && timeLeft === 0) {
      handleSubmit();
    }
  }, [step, timeLeft]);

  const formatTime = (s: number): string =>
    `${Math.floor(s / 60)}:${("0" + (s % 60)).slice(-2)}`;

  const handleChange = (id: number, val: string) =>
    setAnswers(prev => ({ ...prev, [id]: val }));

  const eraseAnswer = (id: number) => {
    const newAnswers = { ...answers };
    delete newAnswers[id];
    setAnswers(newAnswers);
  };

  const handleStart = () => {
    if (!name.trim()) {
      alert(
        "Oh come on, you don’t have a name? \nEven mysterious quiz ninjas need one. 😒"
      );
      return;
    }
    const validEnroll = /^\d{10}$/.test(enroll) ? enroll : DEFAULT_ENROLL;
    setEnroll(validEnroll);
    setStep("quiz");
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => !(q.id in answers));
    if (unanswered.length > 0) {
      alert(
        `Skipping questions, are we? \n🙄 You've left ${unanswered.length} out of ${questions.length} unanswered. Try again, champ.`
      );
      return;
    }
    setStep("result");
  };

  const calculateScore = () =>
    questions.reduce(
      (acc, q) => (answers[q.id] === q.correct ? acc + 1 : acc),
      0
    );

  const generatePDF = () => {
    const doc = new jsPDF();
    const score = calculateScore();

    const grade =
      score >= 40
        ? "A — Excellent!"
        : score >= 30
        ? "B — Good effort!"
        : score >= 20
        ? "C — Just passed"
        : "F — Better luck next time";

    const status = score >= 20 ? "PASS" : "FAIL";

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Indira Gandhi National Open University", 105, 20, {
      align: "center"
    });

    // Subtitle
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("BEVAE181 - Environmental Studies", 105, 30, {
      align: "center"
    });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Summary Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Performance Summary", 105, 50, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${name}`, 20, 60);
    doc.text(`Enrollment No.: ${enroll}`, 20, 68);
    doc.text(`Program: BCA_NEW`, 20, 76);
    doc.text(`Score: ${score}/50`, 20, 84);
    doc.text(`Grade: ${grade}`, 20, 92);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(score >= 20 ? "green" : "red");
    doc.text(`Status: ${status}`, 20, 100);
    doc.setTextColor("black");

    // Start Questions Section
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Question-wise Response", 105, 115, { align: "center" });

    doc.setFont("helvetica", "normal");

    let y = 125;
    questions.forEach((q, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(`Q${i + 1}. ${q.question}`, 20, y);
      y += 6;

      q.options.forEach(opt => {
        const mark = opt === answers[q.id] ? "[x]" : "[ ]";
        doc.setFont("helvetica", opt === q.correct ? "bold" : "normal");
        doc.text(`${mark} ${opt}`, 25, y);
        y += 5;
      });

      doc.setFont("helvetica", "italic");
      doc.text(`Correct Answer: ${q.correct}`, 25, y);
      y += 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`BEVAE181_${enroll}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-800">
      {step === "welcome" && (
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">BEVAE181 Quiz</h1>
          <p className="italic text-sm text-red-600">
            Are you ready to give BEVAE181 quiz? You've 2 hrs but not on my
            watch. Feel free to cheat—only if you can, because I won’t give you
            a chance. 😎
          </p>
          <input
            type="text"
            placeholder="Your Name"
            className="border px-4 py-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enrollment num or blank"
            className="border px-4 py-2 rounded"
            value={enroll}
            onChange={e => setEnroll(e.target.value)}
          />
          <br />
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Quiz
          </button>
        </div>
      )}

      {step === "quiz" && (
        <>
          <div className="sticky top-2 bg-white z-10 p-2 border-b flex justify-between items-center">
            <span className="font-bold text-red-600">
              ⏱ {formatTime(timeLeft)}
            </span>
            <span className="font-semibold">BEVAE181</span>
            <span className="text-sm text-gray-600">
              {Object.keys(answers).length}/{questions.length}
            </span>
          </div>

          <div className="space-y-6 mt-4">
            {questions.map(q => (
              <div key={q.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <p className="font-medium">
                    {q.id}. {q.question}
                  </p>
                  <span className="text-sm text-right text-gray-500">
                    (1 mark)
                  </span>
                </div>
                <div
                  className={`grid ${
                    q.options.some(opt => opt.length > 30)
                      ? "grid-cols-1"
                      : "grid-cols-2"
                  } gap-2 mt-3`}
                >
                  {q.options.map(opt => (
                    <label
                      key={opt}
                      className="flex items-center border rounded px-2 py-1 hover:bg-gray-100"
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleChange(q.id, opt)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                <button
                  className="text-xs text-blue-500 mt-2 underline"
                  onClick={() => eraseAnswer(q.id)}
                >
                  🧽 Erase Answer
                </button>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Quiz
            </button>
          </div>
        </>
      )}

      {step === "result" && (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Quiz Submitted!</h2>
          <p>
            You scored <span className="font-bold">{calculateScore()}/50</span>
          </p>
          <button
            onClick={generatePDF}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Download Result PDF
          </button>
        </div>
      )}
    </div>
  );
}
