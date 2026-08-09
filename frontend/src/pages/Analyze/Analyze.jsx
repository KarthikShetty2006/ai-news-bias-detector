import { useEffect, useState } from "react";
import {
  Brain,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Container from "../../components/layout/Container";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";

import { analyzeText } from "../../services/mlService";

function percentage(value) {
  if (typeof value !== "number") {
    return null;
  }

  return `${Math.round(value * 100)}%`;
}

function ResultItem({
  title,
  value,
  detail,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-xl font-semibold capitalize text-slate-900">
        {String(value).toLowerCase()}
      </p>

      {detail && (
        <p className="mt-1 text-xs text-slate-400">
          {detail}
        </p>
      )}

    </div>
  );
}

function AnalysisResult({
  result,
  onViewAnalyzed,
}) {
  if (!result) {
    return null;
  }

  const sentiment = result?.sentiment;
  const subjectivity = result?.subjectivity;
  const clickbait = result?.clickbait;
  const bias = result?.bias;

  return (
    <div className="mt-10">

      <div className="mb-6 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white">
          <CheckCircle2 size={20} />
        </div>

        <div>
          <p className="text-sm font-medium text-blue-600">
            Analysis Complete
          </p>

          <h2 className="text-2xl font-semibold text-slate-900">
            AI Analysis
          </h2>
        </div>

      </div>

      <Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <ResultItem
            title="Political Bias"
            value={bias?.label || "Unknown"}
            detail={
              bias?.confidence !== undefined
                ? `${percentage(
                    bias.confidence
                  )} confidence`
                : null
            }
          />

          <ResultItem
            title="Sentiment"
            value={
              sentiment?.label || "Unknown"
            }
            detail={
              sentiment?.score !== undefined
                ? `${percentage(
                    sentiment.score
                  )} score`
                : null
            }
          />

          <ResultItem
            title="Subjectivity"
            value={
              typeof subjectivity?.subjectivity ===
              "number"
                ? subjectivity.subjectivity.toFixed(
                    2
                  )
                : "Unknown"
            }
          />

          <ResultItem
            title="Clickbait"
            value={
              clickbait?.is_clickbait
                ? "Detected"
                : "Not detected"
            }
            detail={
              clickbait?.probability !== undefined
                ? `${percentage(
                    clickbait.probability
                  )} probability`
                : null
            }
          />

        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">

          <button
            type="button"
            onClick={onViewAnalyzed}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 text-sm font-medium text-white shadow-sm transition hover:opacity-95 sm:w-auto"
          >
            <Sparkles size={17} />
            View in Analyzed News
          </button>

        </div>

      </Card>

    </div>
  );
}

export default function Analyze() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [articleMeta, setArticleMeta] = useState(null);

  useEffect(() => {
    const savedText =
      sessionStorage.getItem(
        "newsToAnalyze"
      );

    const savedMeta =
      sessionStorage.getItem(
        "newsToAnalyzeMeta"
      );

    if (savedText) {
      setText(savedText);

      sessionStorage.removeItem(
        "newsToAnalyze"
      );
    }

    if (savedMeta) {
      try {
        setArticleMeta(
          JSON.parse(savedMeta)
        );
      } catch {
        setArticleMeta(null);
      }
    }
  }, []);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!text.trim()) {
      setError(
        "Please enter or paste a news article."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await analyzeText(
        text.trim()
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Analysis failed."
        );
      }

      setResult(response.data);

    } catch (err) {
      console.error(
        "ML analysis failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to analyze the article."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalyzed = () => {
  if (!result) {
    return;
  }

  const analyzedArticle = {
    id: `analyzed-${Date.now()}`,

    title:
      articleMeta?.title ||
      "Analyzed Article",

    description:
      articleMeta?.description || "",

    publisher:
      articleMeta?.publisher ||
      articleMeta?.author ||
      "Unknown",

    author:
      articleMeta?.author || "",

    image:
      articleMeta?.image || "",

    url:
      articleMeta?.url || "",

    publishedAt:
      articleMeta?.publishedAt || null,

    analysis: result,

    analyzedText: text,

    analyzedAt:
      new Date().toISOString(),
  };

  const existing = JSON.parse(
    sessionStorage.getItem(
      "analyzedNews"
    ) || "[]"
  );

  /*
   * Add ONLY the article that was
   * currently analyzed.
   */
  const updated = [
    analyzedArticle,
    ...existing,
  ];

  sessionStorage.setItem(
    "analyzedNews",
    JSON.stringify(updated)
  );

  /*
   * Navigate after saving.
   */
  navigate("/analyzed");
};

  return (
    <main className="py-12 md:py-16">

      <Container>

        <PageHeader
          eyebrow="AI Analysis"
          title="Analyze News"
          description="Paste a news article and let the AI analyze its bias, sentiment, subjectivity and clickbait."
        />

        <div className="mx-auto mt-10 max-w-4xl">

          <Card>

            <form onSubmit={handleAnalyze}>

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white">
                  <Brain size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Article Text
                  </h2>

                  <p className="text-sm text-slate-500">
                    Paste the complete article or use
                    "Copy to Analyze" from All News.
                  </p>
                </div>

              </div>

              <textarea
                value={text}
                onChange={(event) =>
                  setText(event.target.value)
                }
                placeholder="Paste the news article here..."
                rows={14}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-5 flex justify-end">

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 text-sm font-medium text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      Analyze Article
                    </>
                  )}
                </button>

              </div>

            </form>

          </Card>

          <AnalysisResult
            result={result}
            onViewAnalyzed={
              handleViewAnalyzed
            }
          />

        </div>

      </Container>

    </main>
  );
}