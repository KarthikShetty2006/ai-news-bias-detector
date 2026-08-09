import {
    getArticles
} from "../services/newsService.js";

import { formatArticle } from "../utils/articleFormatter.js";

export const getAllArticles = async (req, res) => {

    try {

        const articles = await getArticles();

        return res.status(200).json({

            success: true,

            count: articles.length,

            data: articles.map(formatArticle)

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};