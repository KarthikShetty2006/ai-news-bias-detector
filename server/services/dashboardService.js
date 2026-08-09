import Article from "../models/Article.js";

export const getSentimentStats = async () => {

    const result = await Article.aggregate([
        {
            $group: {
                _id: "$analysis.sentiment.label",
                count: { $sum: 1 }
            }
        }
    ]);

    return result.map(item => ({
        name: item._id,
        value: item.count
    }));
};

export const getBiasStats = async () => {

    const result = await Article.aggregate([
        {
            $group: {
                _id: "$analysis.bias.label",
                count: { $sum: 1 }
            }
        }
    ]);

    return result.map(item => ({
        name: item._id,
        value: item.count
    }));
};

export const getClickbaitStats = async () => {

    const result = await Article.aggregate([
        {
            $group: {
                _id: "$analysis.clickbait.is_clickbait",
                count: { $sum: 1 }
            }
        }
    ]);

    return result.map(item => ({
        name: item._id ? "Clickbait" : "Not Clickbait",
        value: item.count
    }));
};

export const getPublisherStats = async () => {

    const result = await Article.aggregate([
        {
            $group: {
                _id: "$publisher",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 10
        }
    ]);

    return result.map(item => ({
        publisher: item._id,
        articles: item.count
    }));
};