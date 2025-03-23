import Link from "next/link";
import List from "./components/list";
import styles from "./page.module.css";
export const dynamic = "force-dynamic";

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className={styles.container}>
      <h1>All Categories</h1>
      {categories.length > 0 ? (
        <List
          items={categories}
          renderItem={(cat) => (
            <Link href={`/questions/${cat.slug}`}>
              <a className={styles.categoryLink}>{cat.name}</a>
            </Link>
          )}
        />
      ) : (
        <p>No categories available.</p>
      )}

      <div className={styles.manageButtonContainer}>
        <Link href="/manage">
          <a className={styles.manageButton}>Manage Data</a>
        </Link>
      </div>
    </main>
  );
}