import Bookmark from "../models/Bookmark.js";
import Article from "../models/Article.js";
export const addBookmark = async (userId, articleId) => {

    const article = await Article.findById(articleId);

    if (!article) {
        throw new Error("Article not found");
    }

    return Bookmark.findOneAndUpdate(
        {
            user: userId,
            article: articleId,
        },
        {},
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );
};

export const removeBookmark = async (userId, articleId) => {

    return Bookmark.findOneAndDelete({
        user: userId,
        article: articleId
    });
};

export const getBookmarks = async (userId) => {

    return Bookmark.find({ user: userId })
        .populate("article")
        .sort({ createdAt: -1 });

};