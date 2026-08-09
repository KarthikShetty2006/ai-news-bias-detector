import { analyzeArticle } from "../services/mlService.js";

export const analyzeText = async (req, res) => {

    try {

        const { text } = req.body;

        if (!text) {

            return res.status(400).json({

                success: false,

                message: "Text is required."

            });

        }

        const prediction = await analyzeArticle(text);

        return res.status(200).json({

            success: true,

            data: prediction

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};