import { notFound } from "next/navigation";
import QuestionDetail from "../../components/QuestionDetail";

async function getCategoryWithQuestions(slug) {
  const catRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${slug}`
  );
  if (!catRes.ok) {
    notFound();
  }
  const category = await catRes.json();

  // Fetch questions for the category
  const qRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${slug}/questions`
  );
  if (!qRes.ok) {
    notFound();
  }
  const questions = await qRes.json();

  return { category, questions };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const { category, questions } = await getCategoryWithQuestions(slug);

  return (
    <main>
      <h2>Category: {category.name}</h2>
      {questions.length === 0 ? (
        <p>No questions found for this category.</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q.id}>
              <QuestionDetail question={q} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}