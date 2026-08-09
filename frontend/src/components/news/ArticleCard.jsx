import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";

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

export default function ArticleCard({ article }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
  const articleText = [
    article.title,
    article.description,
    article.content,
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    await navigator.clipboard.writeText(articleText);

    sessionStorage.setItem(
      "newsToAnalyze",
      articleText
    );

    sessionStorage.setItem(
      "newsToAnalyzeMeta",
      JSON.stringify({
        title: article.title,
        publisher: article.publisher,
        image: article.image,
        url: article.url,
      })
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

  } catch (error) {
    console.error(
      "Failed to copy article:",
      error
    );
  }
};

  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0">

      {/* Image */}

      <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

        {article.image ? (
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm font-medium text-indigo-400">
              AI News
            </span>
          </div>
        )}

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

          {article.publisher &&
            article.publishedAt && (
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

        {/* Actions */}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">

          <Button
            type="button"
            onClick={handleCopy}
            className="h-10 px-4"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy to Analyze
              </>
            )}
          </Button>

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Read
              <ExternalLink size={15} />
            </a>
          )}

        </div>

      </div>

    </Card>
  );
}