import * as statsService from "../services/statsService.js";

export const getStatistics = async (req, res, next) => {

    try {

        const stats = await statsService.getStatistics();

        res.status(200).json({

            success: true,

            data: stats

        });

    } catch (err) {

        next(err);

    }

};