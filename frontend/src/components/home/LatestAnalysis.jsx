import Container from "../layout/Container";
import ArticleCard from "../cards/ArticleCard";

const articles = [
  {
    source: "Reuters",
    date: "Today",
    title: "European Union introduces new AI regulations",
    summary:
      "AI summarizes the article and highlights the key points before the user starts reading.",
    bias: "Neutral",
    sentiment: "Positive",
  },
  {
    source: "BBC",
    date: "Yesterday",
    title: "Climate change policies continue to evolve",
    summary:
      "Understand the political leaning, emotional tone and clickbait level within seconds.",
    bias: "Left",
    sentiment: "Neutral",
  },
  {
    source: "The Guardian",
    date: "2 days ago",
    title: "Global economy sees signs of recovery",
    summary:
      "Our AI extracts the important information so readers can save time.",
    bias: "Neutral",
    sentiment: "Positive",
  },
];
export default function LatestAnalysis() {
  return (
    <section className="bg-slate-50 py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Latest AI Analysis
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Explore recent articles analyzed by our AI engine.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.title}
              article={article}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}