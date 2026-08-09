import express from "express";
import {
    saveBookmark,
    getBookmarks,
    deleteBookmark
} from "../controllers/bookmarkController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/:articleId", saveBookmark);
router.get("/", getBookmarks);
router.delete("/:articleId", deleteBookmark);

export default router;