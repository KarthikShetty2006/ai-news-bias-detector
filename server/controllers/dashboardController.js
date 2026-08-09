import * as dashboardService from "../services/dashboardService.js";

export const getSentiment = async (req, res, next) => {
    try {
        const data = await dashboardService.getSentimentStats();

        res.json({
            success: true,
            data
        });

    } catch (err) {
        next(err);
    }
};

export const getBias = async (req, res, next) => {
    try {
        const data = await dashboardService.getBiasStats();

        res.json({
            success: true,
            data
        });

    } catch (err) {
        next(err);
    }
};

export const getClickbait = async (req, res, next) => {
    try {
        const data = await dashboardService.getClickbaitStats();

        res.json({
            success: true,
            data
        });

    } catch (err) {
        next(err);
    }
};

export const getPublishers = async (req, res, next) => {
    try {
        const data = await dashboardService.getPublisherStats();

        res.json({
            success: true,
            data
        });

    } catch (err) {
        next(err);
    }
};