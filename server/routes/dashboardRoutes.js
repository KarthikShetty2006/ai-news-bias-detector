import express from "express";

import {
    getSentiment,
    getBias,
    getClickbait,
    getPublishers
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/sentiment", getSentiment);

router.get("/bias", getBias);

router.get("/clickbait", getClickbait);

router.get("/publishers", getPublishers);

export default router;