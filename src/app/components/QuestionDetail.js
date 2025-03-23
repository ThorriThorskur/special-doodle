"use client";

import { useState } from "react";
import styles from "../questions/[slug]/QuestionDetail.module.css";

export default function QuestionDetail({ question }) {
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setSelectedAnswerId(Number(e.target.value));
    // Reset the submitted flag if the user changes the selection
    setSubmitted(false);
  }

  function handleSubmit() {
    if (selectedAnswerId !== null) {
      setSubmitted(true);
    }
  }

  return (
    <div className={styles.questionDetail}>
      <h3>{question.title}</h3>
      <ul className={styles.answerList}>
        {question.answers.map((ans) => {
          const isSelected = selectedAnswerId === ans.id;
          // Only apply the selected styling if the answer has been submitted
          const answerClass = `${styles.answer} ${
            submitted && isSelected
              ? ans.correct
                ? styles.answerSelectedCorrect
                : styles.answerSelectedIncorrect
              : ""
          }`;

          return (
            <li key={ans.id} className={answerClass}>
              <label className={styles.answerRadio}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={ans.id}
                  onChange={handleChange}
                  disabled={submitted}  // Optionally disable changing after submit
                />
                <span>{ans.answer}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <button
        onClick={handleSubmit}
        disabled={selectedAnswerId === null || submitted}
        className={styles.submitButton}
      >
        Submit Answer
      </button>
    </div>
  );
}