import { useEffect, useState } from "react";
import {
  Brain,
  ExternalLink,
  MessageSquareText,
  MousePointerClick,
  Scale,
} from "lucide-react";

import Container from "../../components/layout/Container";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/ui/SearchInput";
import EmptyState from "../../components/ui/EmptyState";
import Card from "../../components/ui/Card";

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function percentage(value) {
  if (typeof value !== "number") {
    return null;
  }

  return `${Math.round(value * 100)}%`;
}

function AnalysisItem({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon size={13} />
        {label}
      </div>

      <p className="mt-2 truncate text-sm font-semibold capitalize text-slate-800">
        {String(value).toLowerCase()}
      </p>

      {detail && (
        <p className="mt-1 text-[11px] text-slate-400">
          {detail}
        </p>
      )}

    </div>
  );
}

function AnalyzedArticleCard({ article }) {
  const analysis = article?.analysis;

  if (!analysis) {
    return null;
  }

  const bias = analysis?.bias;
  const sentiment = analysis?.sentiment;
  const subjectivity =
    analysis?.subjectivity;
  const clickbait =
    analysis?.clickbait;

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">

      {/* Image */}

      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

        {article.image ? (
          <img
            src={article.image}
            alt={
              article.title ||
              "Analyzed news"
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Brain
              size={42}
              className="text-indigo-300"
            />
          </div>
        )}

        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur">
            <Brain size={13} />
            AI Analyzed
          </span>
        </div>

      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-6">

        <div className="flex items-center gap-2 text-xs text-slate-500">

          {article.publisher && (
            <span className="font-medium text-slate-700">
              {article.publisher}
            </span>
          )}

          {article.publisher &&
            article.publishedAt && (
              <span className="text-slate-300">
                •
              </span>
            )}

          {article.publishedAt && (
            <span>
              {formatDate(
                article.publishedAt
              )}
            </span>
          )}

        </div>

        <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-slate-900">
          {article.title ||
            "Analyzed Article"}
        </h2>

        {article.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
            {article.description}
          </p>
        )}

        {/* AI Analysis */}

        <div className="mt-6">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            AI Analysis
          </p>

          <div className="grid grid-cols-2 gap-3">

            <AnalysisItem
              icon={Scale}
              label="Political Bias"
              value={
                bias?.label ||
                "Unknown"
              }
              detail={
                bias?.confidence !==
                undefined
                  ? `${percentage(
                      bias.confidence
                    )} confidence`
                  : null
              }
            />

            <AnalysisItem
              icon={MessageSquareText}
              label="Sentiment"
              value={
                sentiment?.label ||
                "Unknown"
              }
              detail={
                sentiment?.score !==
                undefined
                  ? `${percentage(
                      sentiment.score
                    )} score`
                  : null
              }
            />

            <AnalysisItem
              icon={Brain}
              label="Subjectivity"
              value={
                typeof subjectivity?.subjectivity ===
                "number"
                  ? subjectivity.subjectivity.toFixed(
                      2
                    )
                  : "Unknown"
              }
            />

            <AnalysisItem
              icon={MousePointerClick}
              label="Clickbait"
              value={
                clickbait?.is_clickbait
                  ? "Detected"
                  : "Not detected"
              }
              detail={
                clickbait?.probability !==
                undefined
                  ? `${percentage(
                      clickbait.probability
                    )} probability`
                  : null
              }
            />

          </div>

        </div>

        <div className="mt-auto pt-6">

          {article.url ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              Read original article
              <ExternalLink size={15} />
            </a>
          ) : (
            <span className="text-xs text-slate-400">
              Manually analyzed article
            </span>
          )}

        </div>

      </div>

    </Card>
  );
}

export default function AnalyzedNews() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");

  /*
   * Only load articles that were explicitly
   * analyzed from the Analyze page.
   */
  useEffect(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(
          "analyzedNews"
        ) || "[]"
      );

      setArticles(
        Array.isArray(saved)
          ? saved
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load analyzed news:",
        error
      );

      setArticles([]);
    }
  }, []);

  /*
   * Search only the manually analyzed articles.
   */
  const filteredArticles =
    articles.filter((article) => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        article.title
          ?.toLowerCase()
          .includes(query) ||
        article.description
          ?.toLowerCase()
          .includes(query) ||
        article.publisher
          ?.toLowerCase()
          .includes(query)
      );
    });

  return (
    <main className="py-12 md:py-16">

      <Container>

        <PageHeader
          eyebrow="AI Analysis"
          title="Analyzed News"
          description="News articles you have submitted for AI analysis."
        />

        <div className="mt-8 w-full max-w-xl">
          <SearchInput
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search analyzed news..."
          />
        </div>

        <section className="mt-10">

          {filteredArticles.length ===
            0 && (
            <EmptyState
              title={
                search
                  ? "No analyzed news found"
                  : "No analyzed news yet"
              }
              description={
                search
                  ? "Try another search."
                  : "Copy an article from All News, analyze it, and it will appear here."
              }
            />
          )}

          {filteredArticles.length >
            0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">

              {filteredArticles.map(
                (article, index) => (
                  <AnalyzedArticleCard
                    key={
                      article._id ||
                      `${article.url}-${index}`
                    }
                    article={article}
                  />
                )
              )}

            </div>
          )}

        </section>

      </Container>

    </main>
  );
}