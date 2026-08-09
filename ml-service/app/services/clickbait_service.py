import re
import logging

logger = logging.getLogger(__name__)

CLICKBAIT_WORDS = [
    "shocking",
    "amazing",
    "unbelievable",
    "secret",
    "secrets",
    "revealed",
    "you won't believe",
    "what happened next",
    "must see",
    "viral",
    "epic",
    "mind blowing",
    "insane",
    "never",
    "always",
    "everyone",
    "nobody",
    "guaranteed",
    "exclusive",
    "breaking"
]


def analyze_clickbait(text: str) -> dict:
    """
    Analyze whether a news headline is clickbait.

    Returns:
    {
        "probability": 0.76,
        "is_clickbait": True
    }
    """

    try:

        score = 0

        headline = text.lower()

        # Keyword scoring
        for word in CLICKBAIT_WORDS:
            if word in headline:
                score += 1

        # Multiple exclamation marks
        if "!!" in headline:
            score += 1

        # Question marks
        if "?" in headline:
            score += 1

        # ALL CAPS words
        caps_words = re.findall(r"\b[A-Z]{3,}\b", text)
        score += len(caps_words)

        # Normalize score (0 to 1)
        probability = min(score / 5, 1.0)

        return {
            "probability": round(probability, 2),
            "is_clickbait": probability >= 0.5
        }

    except Exception as e:
        logger.exception("Clickbait prediction failed.")
        raise Exception(str(e))