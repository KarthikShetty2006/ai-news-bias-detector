import Article from "../models/Article.js";
import crypto from "crypto";

import { analyzeArticle } from "../services/mlService.js";


export const analyzeText = async (req, res) => {
  try {
    const {
      text,
      articleMeta = {},
    } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required.",
      });
    }

    /* ================================
       Run ML analysis
    ================================= */

    const prediction =
      await analyzeArticle(text.trim());


    /* ================================
       Prepare article data
    ================================= */

    const title =
      articleMeta.title?.trim() ||
      "Analyzed Article";

    const description =
      articleMeta.description || "";

    const content =
      articleMeta.content ||
      text.trim();

    const author =
      articleMeta.author ||
      "Unknown";

    const publisher =
      articleMeta.publisher ||
      "Unknown";

    const image =
      articleMeta.image || "";

    const topic =
      articleMeta.topic || "";

    const url =
      articleMeta.url?.trim() ||
      `analyzed://${crypto
        .createHash("sha256")
        .update(text.trim())
        .digest("hex")}`;


    /* ================================
       Save to MongoDB
    ================================= */

    const savedArticle =
      await Article.findOneAndUpdate(
        { url },

        {
          $set: {
            title,
            description,
            content,
            author,
            publisher,
            url,
            image,
            topic,
            analysis: prediction,

            ...(articleMeta.publishedAt
              ? {
                  publishedAt:
                    articleMeta.publishedAt,
                }
              : {}),
          },
        },

        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );


    return res.status(200).json({
      success: true,
      data: prediction,
      article: savedArticle,
    });

  } catch (error) {

    console.error(
      "Article analysis failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =================================================
   GET ANALYZED ARTICLES
================================================= */

export const getAnalyzedArticles = async (
  req,
  res
) => {

  try {

    const articles =
      await Article.find({
        "analysis.bias.label": {
          $exists: true,
        },
      })
        .sort({
          updatedAt: -1,
        })
        .lean();


    return res.status(200).json({

      success: true,

      count: articles.length,

      articles,

    });

  } catch (error) {

    console.error(
      "Failed to fetch analyzed articles:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch analyzed articles.",

    });

  }
};