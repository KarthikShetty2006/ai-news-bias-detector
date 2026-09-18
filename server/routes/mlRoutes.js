import express from "express";

import {
  analyzeText,
  getAnalyzedArticles,
} from "../controllers/mlController.js";


const router = express.Router();


/*
 * Analyze article
 */
router.post(
  "/analyze",
  analyzeText
);


/*
 * Get articles that have been analyzed
 */
router.get(
  "/analyzed",
  getAnalyzedArticles
);


export default router;