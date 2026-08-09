import express from "express";

import {
  searchNews,
  getAllArticles,
  getArticle,
  getPublishers,
  getSentiment,
  getBias,
  getClickbait,
  analyzeText,
  deleteArticle,
} from "../controllers/newsController.js";

const router = express.Router();

// Fetch latest news
router.get("/search", searchNews);

// Filters & Dashboard
router.get("/publishers", getPublishers);
router.get("/sentiment", getSentiment);
router.get("/bias", getBias);
router.get("/clickbait", getClickbait);

// AI Analysis
router.post("/analyze", analyzeText);

// Articles
router.get("/", getAllArticles);
router.get("/:id", getArticle);

// Admin
router.delete("/:id", deleteArticle);

export default router;