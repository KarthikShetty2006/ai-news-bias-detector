import express from "express";

import { analyzeText } from "../controllers/mlController.js";

const router = express.Router();

router.post("/analyze", analyzeText);

export default router;