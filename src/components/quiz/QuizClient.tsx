"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import quizData from "@/data/quiz.json";

interface Question {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function QuizClient() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = quizData.questions as Question[];
  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (showAnswer) return; // Can't change selection after showing answer
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null) return;
    
    if (selectedOpt === currentQuestion.answerIndex) {
      setCorrectCount((prev) => prev + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setShowAnswer(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowAnswer(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  // Get result text feedback
  const getFeedback = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct === 100) return { title: "Perfect Score! 🌟", desc: "You have completely mastered CV writing principles. Your resumes will be highly professional and ATS-optimized." };
    if (pct >= 80) return { title: "Great Job! 🎉", desc: "You have a strong understanding of how ATS systems work and how to write quality bullet points. You're ready to build!" };
    if (pct >= 50) return { title: "Passed! 👍", desc: "You know the basics, but reviewing the course materials on experience bullets and layout would make your CV even stronger." };
    return { title: "Need Review 📚", desc: "We recommend going through the course modules again, especially lesson 3 (Bullets) and lesson 4 (Style & Formatting)." };
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      {currentIdx === 0 && !showAnswer && !quizFinished ? (
        <div>
          <Link href="/course/" className="text-sm font-semibold text-accent-text hover:text-accent flex items-center gap-1 mb-2">
            &larr; Back to Learning
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
            CV Writing Knowledge Quiz
          </h1>
          <p className="font-sans text-xs md:text-sm text-muted leading-relaxed mt-1">
            Test your understanding of applicant tracking systems, resume templates, and writing principles.
          </p>
        </div>
      ) : !quizFinished ? (
        <div className="flex items-center justify-between border-b border-border pb-2">
          <Link href="/course/" className="text-xs font-semibold text-accent-text hover:text-accent">
            &larr; Exit Quiz
          </Link>
          <span className="text-xs text-muted-2 font-bold font-mono">Question {currentIdx + 1} of {questions.length}</span>
        </div>
      ) : null}

      {!quizFinished ? (
        <Card className="flex flex-col gap-4 p-4 sm:p-5">
          {/* Progress Header */}
          <div className="flex justify-between items-center border-b border-border pb-2 text-[11px] text-muted font-semibold">
            <span className="label-micro">Score Tracker</span>
            <span className="font-mono">Current: {correctCount} / {currentIdx} correct</span>
          </div>

          {/* Question Text */}
          <h2 className="font-serif text-lg md:text-xl font-bold text-ink leading-snug">
            {currentQuestion.text}
          </h2>

          {/* Options Grid */}
          <div className="flex flex-col gap-2.5">
            {currentQuestion.options.map((option, idx) => {
              // Styling conditions based on showAnswer state
              let btnStyle = "border-border-strong hover:border-muted bg-paper text-ink-2";
              
              if (selectedOpt === idx) {
                btnStyle = "border-accent bg-accent/5 text-accent-text";
              }
              
              if (showAnswer) {
                if (idx === currentQuestion.answerIndex) {
                  btnStyle = "border-success bg-success/10 text-success font-semibold";
                } else if (selectedOpt === idx) {
                  btnStyle = "border-danger bg-danger/10 text-danger font-semibold";
                } else {
                  btnStyle = "border-border-strong opacity-50 bg-paper text-muted";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showAnswer}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full flex items-start text-left p-3.5 rounded-xl border text-xs md:text-sm font-sans transition-all duration-150 focus-ring ${btnStyle}`}
                >
                  <span className="font-mono mr-3 shrink-0 font-bold opacity-60">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation panel */}
          {showAnswer && (
            <div className="bg-surface/50 border border-border p-3.5 rounded-xl flex flex-col gap-1 animate-fade-in">
              <span className="label-micro text-[10px] text-accent-text font-bold">
                {selectedOpt === currentQuestion.answerIndex ? "✓ Correct!" : "✗ Incorrect"}
              </span>
              <p className="text-xs font-sans text-ink-2 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end mt-1">
            {!showAnswer ? (
              <Button
                variant="primary"
                onClick={handleSubmitAnswer}
                className={`w-full sm:w-auto ${selectedOpt === null ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Submit Answer
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext} className="w-full sm:w-auto">
                {currentIdx < questions.length - 1 ? "Next Question" : "View Results"}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        /* Results Card */
        <Card className="flex flex-col items-center text-center gap-5 py-8 px-6">
          <div className="text-accent-text bg-accent/10 p-4.5 rounded-full">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">
              {getFeedback(correctCount, questions.length).title}
            </h2>
            <p className="font-mono text-3xl font-extrabold text-accent mt-2">
              {correctCount} / {questions.length}
            </p>
            <p className="text-sm text-muted mt-1 font-semibold">
              ({Math.round((correctCount / questions.length) * 100)}% Correct)
            </p>
          </div>

          <p className="font-sans text-sm md:text-base text-muted leading-relaxed max-w-md">
            {getFeedback(correctCount, questions.length).desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-3">
            <Button variant="secondary" onClick={handleRestart} className="w-full sm:w-auto">
              Retake Quiz
            </Button>
            <Link href="/builder/" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full">
                Build Your CV
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
