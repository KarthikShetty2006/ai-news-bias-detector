import "../config/env.js";
import axios from "axios";
import Article from "../models/Article.js";

const BASE_URL = process.env.NEWS_API_URL;
const API_KEY = process.env.NEWS_API_KEY;

/**
 * Fetch fresh news directly from GNews.
 *
 * IMPORTANT:
 * This function ONLY fetches news.
 * It does NOT call the ML service.
 * It does NOT save articles to MongoDB.
 */
export const fetchNews = async (
  keyword = "technology",
  page = 1
) => {
  try {
    const startPage = Math.max(
      1,
      Number(page) || 1
    );

    const freshArticles = [];

    /*
     * We may need several GNews pages because
     * some articles may already exist in MongoDB.
     */
    let gnewsPage = startPage;

    const maxGNewsPages = 5;

    while (
      freshArticles.length < 10 &&
      gnewsPage <
        startPage + maxGNewsPages
    ) {
      const response =
        await axios.get(
          `${BASE_URL}/search`,
          {
            params: {
              q: keyword,
              lang: "en",
              max: 10,
              page: gnewsPage,
              sortby: "publishedAt",
              apikey: API_KEY,
            },
          }
        );

      const gnewsArticles =
        response.data.articles || [];

      if (
        gnewsArticles.length === 0
      ) {
        break;
      }

      /*
       * Get URLs from current GNews page.
       */
      const urls =
        gnewsArticles
          .map(
            (article) =>
              article.url
          )
          .filter(Boolean);

      /*
       * Find articles that already exist
       * in MongoDB.
       */
      const existingArticles =
        await Article.find(
          {
            url: {
              $in: urls,
            },
          },
          {
            url: 1,
          }
        ).lean();

      const existingUrls =
        new Set(
          existingArticles.map(
            (article) =>
              article.url
          )
        );

      /*
       * Keep only genuinely new articles.
       */
      const newArticles =
        gnewsArticles.filter(
          (article) =>
            article.url &&
            !existingUrls.has(
              article.url
            ) &&
            !freshArticles.some(
              (existing) =>
                existing.url ===
                article.url
            )
        );

      freshArticles.push(
        ...newArticles
      );

      /*
       * If GNews gave us fewer than 10,
       * go to the next GNews page.
       */
      gnewsPage++;
    }

    /*
     * Return maximum 10 fresh articles.
     */
    return freshArticles.slice(
      0,
      10
    );
  } catch (error) {
    console.error(
      "GNews Error:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      "Unable to fetch news"
    );
  }
};

/**
 * Get previously stored articles.
 *
 * These are the articles already present
 * in MongoDB.
 */
export const getArticles = async (
  filters = {}
) => {
  let {
    page = 1,
    limit = 10,
    sentiment,
    bias,
    clickbait,
    publisher,
    topic,
    search,
    sort = "-publishedAt",
  } = filters;

  page = Math.max(
    1,
    Number(page) || 1
  );

  limit = Math.max(
    1,
    Math.min(
      50,
      Number(limit) || 10
    )
  );

  const skip =
    (page - 1) * limit;

  const query = {};

  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        publisher: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (sentiment) {
    query[
      "analysis.sentiment.label"
    ] = sentiment.toUpperCase();
  }

  if (bias) {
    query[
      "analysis.bias.label"
    ] = bias.toUpperCase();
  }

  if (clickbait !== undefined) {
    query[
      "analysis.clickbait.is_clickbait"
    ] = clickbait === "true";
  }

  if (publisher) {
    query.publisher = {
      $regex: publisher,
      $options: "i",
    };
  }

  if (topic) {
    query.topic = {
      $regex: topic,
      $options: "i",
    };
  }

  const [
    articles,
    total,
  ] = await Promise.all([
    Article.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Article.countDocuments(query),
  ]);

  return {
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit
    ),
  };
};

export const getArticleById = async (
  id
) => {
  const article =
    await Article.findById(id).lean();

  if (!article) {
    throw new Error(
      "Article not found"
    );
  }

  return article;
};

export const deleteArticle = async (
  id
) => {
  const article =
    await Article.findById(id);

  if (!article) {
    throw new Error(
      "Article not found"
    );
  }

  await article.deleteOne();

  return {
    message:
      "Article deleted successfully",
  };
};

export const searchStoredArticles =
  async (keyword) => {
    return await Article.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          topic: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });
  };

export const getPublishers =
  async () => {
    return await Article.distinct(
      "publisher"
    );
  };

export const getSentimentStats =
  async () => {
    return await Article.aggregate([
      {
        $group: {
          _id:
            "$analysis.sentiment.label",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
  };

export const getBiasStats =
  async () => {
    return await Article.aggregate([
      {
        $group: {
          _id:
            "$analysis.bias.label",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
  };

export const getClickbaitStats =
  async () => {
    return await Article.aggregate([
      {
        $group: {
          _id:
            "$analysis.clickbait.is_clickbait",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  };