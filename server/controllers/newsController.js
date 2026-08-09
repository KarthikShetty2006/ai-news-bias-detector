import * as newsService from "../services/newsService.js";
import { analyzeArticle } from "../services/mlService.js";
/*export const searchNews = async (req, res, next) => {
  try {
    const keyword = req.query.q || "technology";

    const page = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const articles = await newsService.fetchNews(
      keyword,
      page
    );

    res.status(200).json({
      success: true,
      count: articles.length,
      page,
      articles,
    });
  } catch (err) {
    next(err);
  }
};
*/
export const searchNews = async (
  req,
  res,
  next
) => {
  try {
    const keyword =
      req.query.q || "technology";

    const page = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const articles =
      await newsService.fetchNews(
        keyword,
        page
      );

    res.status(200).json({
      success: true,
      count: articles.length,
      page,
      articles,
    });
  } catch (err) {
    next(err);
  }
};
export const getAllArticles = async (req, res, next) => {

    try {

        const result = await newsService.getArticles(req.query);

        res.status(200).json({

            success: true,

            ...result

        });

    } catch (err) {

        next(err);

    }

};

export const getArticle = async (req, res, next) => {
  try {
    const article = await newsService.getArticleById(req.params.id);

    res.status(200).json({
      success: true,
      article,
    });
  } catch (err) {
    next(err);
  }
};

export const analyzeText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const analysis = await analyzeArticle(text);

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (err) {
    next(err);
  }
};  

export const deleteArticle = async (req, res, next) => {
  try {
    const result = await newsService.deleteArticle(req.params.id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const getPublishers = async (req, res, next) => {
  try {
    const publishers = await newsService.getPublishers();

    res.status(200).json({
      success: true,
      publishers,
    });
  } catch (err) {
    next(err);
  }
};

export const getSentiment = async (req, res, next) => {
  try {
    const sentiment = await newsService.getSentimentStats();

    res.status(200).json({
      success: true,
      sentiment,
    });
  } catch (err) {
    next(err);
  }
};

export const getBias = async (req, res, next) => {
  try {
    const bias = await newsService.getBiasStats();

    res.status(200).json({
      success: true,
      bias,
    });
  } catch (err) {
    next(err);
  }
};

export const getClickbait = async (req, res, next) => {
  try {
    const clickbait = await newsService.getClickbaitStats();

    res.status(200).json({
      success: true,
      clickbait,
    });
  } catch (err) {
    next(err);
  }
};