import * as bookmarkService from "../services/bookmarkService.js";

export const saveBookmark = async (req, res, next) => {

    try {

        const bookmark = await bookmarkService.addBookmark(
            req.user.id,
            req.params.articleId
        );

        res.status(201).json({
            success: true,
            data: bookmark
        });

    } catch (err) {
        next(err);
    }

};

export const getBookmarks = async (req, res, next) => {

    try {

        const bookmarks = await bookmarkService.getBookmarks(req.user.id);

        res.json({
            success: true,
            data: bookmarks
        });

    } catch (err) {
        next(err);
    }

};

export const deleteBookmark = async (req, res, next) => {

    try {

        await bookmarkService.removeBookmark(
            req.user.id,
            req.params.articleId
        );

        res.json({
            success: true,
            message: "Bookmark removed"
        });

    } catch (err) {
        next(err);
    }

};