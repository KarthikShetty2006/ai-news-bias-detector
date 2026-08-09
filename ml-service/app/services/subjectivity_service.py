from textblob import TextBlob
import logging

logger = logging.getLogger(__name__)


def analyze_subjectivity(text: str) -> dict:
    """
    Analyze subjectivity of a news article.

    Args:
        text (str): News article text.

    Returns:
        dict:
        {
            "subjectivity": 0.78
        }
    """

    try:
        blob = TextBlob(text)

        subjectivity = round(blob.sentiment.subjectivity, 4)

        return {
            "subjectivity": subjectivity
        }

    except Exception as e:
        logger.exception("Subjectivity prediction failed.")
        raise Exception(f"Subjectivity Prediction Error: {str(e)}")