from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

# Load model only once when the application starts
try:
    sentiment_pipeline = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )

    logger.info("Sentiment model loaded successfully.")

except Exception as e:
    logger.exception("Failed to load sentiment model.")
    raise e


def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of a news article.

    Args:
        text (str): News article text.

    Returns:
        dict:
        {
            "label": "POSITIVE",
            "score": 0.9987
        }
    """

    try:

        result = sentiment_pipeline(text)[0]

        return {
            "label": result["label"],
            "score": round(float(result["score"]), 4)
        }

    except Exception as e:

        logger.exception("Sentiment prediction failed.")

        raise Exception(f"Prediction Error : {str(e)}")