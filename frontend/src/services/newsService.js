import api from "./api";

/**
 * Get previously fetched/stored articles
 * from MongoDB.
 */
export async function getArticles(
  params = {}
) {
  const response = await api.get(
    "/news",
    {
      params,
    }
  );

  return response.data;
}

/**
 * Fetch NEW articles from GNews
 * through the Node backend.
 */
export async function fetchFreshNews(
  keyword = "technology",
  page = 1
) {
  const response = await api.get(
    "/news/search",
    {
      params: {
        q: keyword,
        page,
      },
    }
  );

  console.log(
    "Fresh news response:",
    response.data
  );

  return response.data;
}

/**
 * Get one stored article.
 */
export async function getArticleById(
  id
) {
  const response = await api.get(
    `/news/${id}`
  );

  return response.data;
}