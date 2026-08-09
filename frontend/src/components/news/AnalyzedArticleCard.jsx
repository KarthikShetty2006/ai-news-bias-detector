import {
  Brain,
  ExternalLink,
  MessageSquareText,
  MousePointerClick,
  Scale,
} from "lucide-react";

import Card from "../ui/Card";

function formatDate(date) {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPercentage(value) {
  if (typeof value !== "number") return null;

  return `${Math.round(value * 100)}%`;
}

export default function AnalyzedArticleCard({ article }) {
  const analysis = article?.analysis;

  if (!analysis) {
    return null;
  }

  const bias = analysis?.bias;
  const sentiment = analysis?.sentiment;
  const subjectivity = analysis?.subjectivity;
  const clickbait = analysis?.clickbait;

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">

      {/* Article image */}

      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

        {article.image ? (
          <img
            src={article.image}
            alt=""
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

        {/* Publisher */}

        <div className="flex items-center gap-2 text-xs text-slate-500">

          {article.publisher && (
            <span className="font-medium text-slate-700">
              {article.publisher}
            </span>
          )}

          {article.publisher && article.publishedAt && (
            <span className="text-slate-300">
              •
            </span>
          )}

          {article.publishedAt && (
            <span>
              {formatDate(article.publishedAt)}
            </span>
          )}

        </div>

        {/* Title */}

        <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-slate-900">
          {article.title}
        </h2>

        {/* Description */}

        {article.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
            {article.description}
          </p>
        )}

        {/* ML Analysis */}

        <div className="mt-6">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            AI Analysis
          </p>

          <div className="grid grid-cols-2 gap-3">

            {/* Bias */}

            <AnalysisItem
              icon={Scale}
              label="Political Bias"
              value={bias?.label || "Unknown"}
              detail={
                bias?.confidence !== undefined
                  ? `${formatPercentage(
                      bias.confidence
                    )} confidence`
                  : null
              }
            />

            {/* Sentiment */}

            <AnalysisItem
              icon={MessageSquareText}
              label="Sentiment"
              value={
                sentiment?.label || "Unknown"
              }
              detail={
                sentiment?.score !== undefined
                  ? `${formatPercentage(
                      sentiment.score
                    )} score`
                  : null
              }
            />

            {/* Subjectivity */}

            <AnalysisItem
              icon={Brain}
              label="Subjectivity"
              value={
                subjectivity?.subjectivity !== undefined
                  ? subjectivity.subjectivity.toFixed(2)
                  : "Unknown"
              }
            />

            {/* Clickbait */}

            <AnalysisItem
              icon={MousePointerClick}
              label="Clickbait"
              value={
                clickbait?.is_clickbait
                  ? "Detected"
                  : "Not detected"
              }
              detail={
                clickbait?.probability !== undefined
                  ? `${formatPercentage(
                      clickbait.probability
                    )} probability`
                  : null
              }
            />

          </div>

        </div>

        {/* Original article */}

        <div className="mt-auto pt-6">

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Read original article

              <ExternalLink size={15} />
            </a>
          )}

        </div>

      </div>

    </Card>
  );
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