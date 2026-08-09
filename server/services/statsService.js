import Article from "../models/Article.js";

export const getStatistics = async () => {

    const [
        totalArticles,
        sentimentStats,
        biasStats,
        clickbaitStats,
        subjectivityStats,
        topPublishers
    ] = await Promise.all([

        // Total Articles
        Article.countDocuments(),

        // Sentiment Distribution
        Article.aggregate([
            {
                $group: {
                    _id: "$analysis.sentiment.label",
                    count: { $sum: 1 }
                }
            }
        ]),

        // Bias Distribution
        Article.aggregate([
            {
                $group: {
                    _id: "$analysis.bias.label",
                    count: { $sum: 1 }
                }
            }
        ]),

        // Clickbait Distribution
        Article.aggregate([
            {
                $group: {
                    _id: "$analysis.clickbait.is_clickbait",
                    count: { $sum: 1 }
                }
            }
        ]),

        // Average Subjectivity
        Article.aggregate([
            {
                $group: {
                    _id: null,
                    averageSubjectivity: {
                        $avg: "$analysis.subjectivity.subjectivity"
                    }
                }
            }
        ]),

        // Top Publishers
        Article.aggregate([
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
                $limit: 5
            }
        ])

    ]);

    return {

        totalArticles,

        sentimentStats,

        biasStats,

        clickbaitStats,

        averageSubjectivity:
            subjectivityStats[0]?.averageSubjectivity ?? 0,

        topPublishers

    };

};