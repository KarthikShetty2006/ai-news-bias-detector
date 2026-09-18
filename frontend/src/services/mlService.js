import api from "./api";


/* =========================================================
   Analyze Article
========================================================= */

export const analyzeText = async (
  text,
  articleMeta = null
) => {

  const response = await api.post(
    "/ml/analyze",
    {
      text,
      articleMeta,
    }
  );

  return response.data;
};


/* =========================================================
   Get Analyzed Articles
========================================================= */

export const getAnalyzedArticles =
  async () => {

    const response = await api.get(
      "/ml/analyzed"
    );

    return response.data;
  };