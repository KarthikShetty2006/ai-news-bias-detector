export async function copyArticleToAnalyze(article) {
  const articleText = [
    article.title,
    article.description,
    article.content,
  ]
    .filter(Boolean)
    .join("\n\n");

  await navigator.clipboard.writeText(articleText);

  return articleText;
}