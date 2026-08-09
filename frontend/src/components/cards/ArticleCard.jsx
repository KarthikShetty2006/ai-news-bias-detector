import { ExternalLink } from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

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

export default function ArticleCard({
  article,
  analyzed = false,
}) {
  const {
    title,
    description,
    content,
    author,
    publisher,
    url,
    image,
    publishedAt,
    analysis,
  } = article;

  const bias = analysis?.bias?.label;

  const sentiment = analysis?.sentiment?.label;

  const clickbait =
    analysis?.clickbait?.is_clickbait;

  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0">

      {/* Image */}

      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">

        {image ? (
          <img
            src={image}
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

          {publisher && (
            <span className="font-medium text-slate-700">
              {publisher}
            </span>
          )}

          {publisher && publishedAt && (
            <span className="text-slate-300">
              •
            </span>
          )}

          {publishedAt && (
            <span>
              {formatDate(publishedAt)}
            </span>
          )}

        </div>

        {/* Title */}

        <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-slate-900">
          {title}
        </h2>

        {/* Description */}

        {(description || content) && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
            {description || content}
          </p>
        )}

        {/* Analysis */}

        {analyzed && analysis && (
          <div className="mt-5 flex flex-wrap gap-2">

            {bias && (
              <Badge color="blue">
                Bias: {bias}
              </Badge>
            )}

            {sentiment && (
              <Badge color="green">
                Sentiment: {sentiment}
              </Badge>
            )}

            {clickbait !== undefined && (
              <Badge color="orange">
                Clickbait:{" "}
                {clickbait ? "Yes" : "No"}
              </Badge>
            )}

          </div>
        )}

        {/* Footer */}

        <div className="mt-auto pt-6">

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Read article

              <ExternalLink size={15} />
            </a>
          )}

        </div>

      </div>

    </Card>
  );
}