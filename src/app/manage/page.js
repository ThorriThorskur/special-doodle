// src/app/manage/page.js
"use client";

import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import styles from "./manage.module.css";

export default function ManagePage() {
  //category
  const [categoryName, setCategoryName] = useState("");
  const [categoryMsg, setCategoryMsg] = useState("");

  //delete category
  const [deleteCategorySlug, setDeleteCategorySlug] = useState("");
  const [deleteCategoryMsg, setDeleteCategoryMsg] = useState("");

  //question
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionCategoryId, setQuestionCategoryId] = useState("");
  const [answers, setAnswers] = useState([
    { answer: "", correct: false },
    { answer: "", correct: false },
    { answer: "", correct: false },
    { answer: "", correct: false },
  ]);
  const [questionMsg, setQuestionMsg] = useState("");

  //editing/deleting a question
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMsg, setEditMsg] = useState("");
  const [editAnswers, setEditAnswers] = useState([]);

  async function updateCategories() {
    try {
      const res = await fetch(`/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    updateCategories();
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      if (!selectedCat) return;
      try {
        const res = await fetch(`/api/categories/${selectedCat}/questions`);
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, [selectedCat]);

  async function handleCreateCategory(e) {
    e.preventDefault();
    setCategoryMsg("");
    try {
      const res = await fetch(`/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCategoryMsg(data.error || "Error creating category");
      } else {
        setCategoryMsg("Category created successfully!");
        setCategoryName("");
        updateCategories();
      }
    } catch (error) {
      console.error(error);
      setCategoryMsg("Network error creating category");
    }
    setTimeout(() => setCategoryMsg(""), 2000);
  }

  async function handleDeleteCategory(e) {
    e.preventDefault();
    setDeleteCategoryMsg("");
    if (!deleteCategorySlug) return;
    try {
      const res = await fetch(`/api/categories/${deleteCategorySlug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setDeleteCategoryMsg("Error deleting category");
      } else {
        setDeleteCategoryMsg("Category and its questions deleted successfully!");
        updateCategories();
        setDeleteCategorySlug("");
      }
    } catch (error) {
      console.error(error);
      setDeleteCategoryMsg("Network error deleting category");
    }
    setTimeout(() => setDeleteCategoryMsg(""), 2000);
  }

  async function handleCreateQuestion(e) {
    e.preventDefault();
    setQuestionMsg("");
    try {
      const res = await fetch(`/api/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: questionTitle,
          categoryId: parseInt(questionCategoryId),
          answers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setQuestionMsg(data.error || "Error creating question");
      } else {
        setQuestionMsg("Question created successfully!");
        setQuestionTitle("");
        setQuestionCategoryId("");
        setAnswers([
          { answer: "", correct: false },
          { answer: "", correct: false },
          { answer: "", correct: false },
          { answer: "", correct: false },
        ]);
      }
    } catch (error) {
      console.error(error);
      setQuestionMsg("Network error creating question");
    }
    setTimeout(() => setQuestionMsg(""), 2000);
  }

  function handleAnswerChange(index, field, value) {
    const updated = [...answers];
    updated[index][field] = value;
    setAnswers(updated);
  }

  async function handleEditQuestion(e) {
    e.preventDefault();
    setEditMsg("");
    try {
      const res = await fetch(`/api/questions/${selectedQuestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, answers: editAnswers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditMsg(data.error || "Error updating question");
      } else {
        setEditMsg("Question updated successfully!");
      }
    } catch (error) {
      console.error(error);
      setEditMsg("Network error updating question");
    }
    setTimeout(() => setEditMsg(""), 2000);
  }

  async function handleDeleteQuestion() {
    try {
      const res = await fetch(`/api/questions/${selectedQuestion.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setEditMsg("Error deleting question");
      } else {
        setEditMsg("Question deleted successfully!");
        setSelectedQuestion(null);
        const updatedQuestions = questions.filter(
          (q) => q.id !== selectedQuestion.id
        );
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error(error);
      setEditMsg("Network error deleting question");
    }
    setTimeout(() => setEditMsg(""), 2000);
  }

  return (
    <main className={styles.container}>
      <h1>Manage Data</h1>

      <section className={styles.formSection}>
        <h2>Create New Category</h2>
        <form onSubmit={handleCreateCategory}>
          <label>
            Category Name:
            <Input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              minLength={2}
            />
          </label>
          <Button type="submit">Create Category</Button>
        </form>
        {categoryMsg && <p className={styles.message}>{categoryMsg}</p>}
      </section>

      <section className={styles.formSection}>
        <h2>Delete Category</h2>
        <form onSubmit={handleDeleteCategory}>
          <label>
            Select Category to Delete:
            <select
              value={deleteCategorySlug}
              onChange={(e) => setDeleteCategorySlug(e.target.value)}
              required
            >
              <option value="">--Select Category--</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit">Delete Category</Button>
        </form>
        {deleteCategoryMsg && (
          <p className={styles.message}>{deleteCategoryMsg}</p>
        )}
      </section>

      <section className={styles.formSection}>
        <h2>Create New Question</h2>
        <form onSubmit={handleCreateQuestion}>
          <label>
            Question Title:
            <Input
              type="text"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              required
              minLength={3}
            />
          </label>
          <label>
            Select Category:
            <select
              value={questionCategoryId}
              onChange={(e) => setQuestionCategoryId(e.target.value)}
              required
            >
              <option value="">--Select Category--</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.answersSection}>
            <p>Answers:</p>
            {answers.map((ans, idx) => (
              <div key={idx} className={styles.answerItem}>
                <Input
                  type="text"
                  placeholder={`Answer ${idx + 1}`}
                  value={ans.answer}
                  onChange={(e) =>
                    handleAnswerChange(idx, "answer", e.target.value)
                  }
                  required
                />
                <label>
                  Correct:
                  <input
                    type="checkbox"
                    checked={ans.correct}
                    onChange={(e) =>
                      handleAnswerChange(idx, "correct", e.target.checked)
                    }
                  />
                </label>
              </div>
            ))}
          </div>
          <Button type="submit">Create Question</Button>
        </form>
        {questionMsg && <p className={styles.message}>{questionMsg}</p>}
      </section>

      <section className={styles.formSection}>
        <h2>Edit/Delete Question</h2>
        <form>
          <label>
            Select Category:
            <select
              value={selectedCat}
              onChange={(e) => {
                setSelectedCat(e.target.value);
                setQuestions([]);
                setSelectedQuestion(null);
              }}
            >
              <option value="">--Select Category--</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          {questions.length > 0 && (
            <>
              <h3>Questions in Selected Category</h3>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => {
                        setSelectedQuestion(q);
                        setEditTitle(q.title);
                        setEditAnswers(q.answers);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedQuestion && selectedQuestion.id === q.id
                            ? "#f0f0f0"
                            : "transparent",
                      }}
                    >
                      <td>{q.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {selectedQuestion && (
            <div>
              <h3>Edit Question</h3>
              <label>
                Edit Title:
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </label>
              <div className={styles.answersSection}>
                <p>Edit Answers:</p>
                {editAnswers.map((ans, idx) => (
                  <div key={idx} className={styles.answerItem}>
                    <Input
                      type="text"
                      value={ans.answer}
                      onChange={(e) => {
                        const newEditAnswers = [...editAnswers];
                        newEditAnswers[idx].answer = e.target.value;
                        setEditAnswers(newEditAnswers);
                      }}
                      required
                    />
                    <label>
                      Correct:
                      <input
                        type="checkbox"
                        checked={ans.correct}
                        onChange={(e) => {
                          const newEditAnswers = [...editAnswers];
                          newEditAnswers[idx].correct = e.target.checked;
                          setEditAnswers(newEditAnswers);
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <Button onClick={handleEditQuestion}>Save Changes</Button>
                <Button type="button" onClick={handleDeleteQuestion}>
                  Delete Question
                </Button>
              </div>
            </div>
          )}
        </form>
        {editMsg && <p className={styles.message}>{editMsg}</p>}
      </section>
    </main>
  );
}