import logging
import re

logger = logging.getLogger(__name__)

LEFT_KEYWORDS = [
    "climate change",
    "renewable",
    "social justice",
    "equality",
    "welfare",
    "minimum wage",
    "immigration",
    "public healthcare",
    "gun control",
    "diversity"
]

RIGHT_KEYWORDS = [
    "tax cuts",
    "border security",
    "national security",
    "traditional values",
    "free market",
    "military",
    "private healthcare",
    "second amendment",
    "capitalism",
    "law and order"
]


def analyze_bias(text: str) -> dict:
    """
    Temporary political bias detector.

    Later this function will be replaced with a
    transformer model without changing the API.
    """

    try:

        article = text.lower()

        left_score = 0
        right_score = 0

        for word in LEFT_KEYWORDS:
            if re.search(r"\b" + re.escape(word) + r"\b", article):
                left_score += 1

        for word in RIGHT_KEYWORDS:
            if re.search(r"\b" + re.escape(word) + r"\b", article):
                right_score += 1

        total = left_score + right_score

        if total == 0:
            return {
                "label": "CENTER",
                "confidence": 0.50
            }

        confidence = round(max(left_score, right_score) / total, 2)

        if left_score > right_score:
            label = "LEFT"

        elif right_score > left_score:
            label = "RIGHT"

        else:
            label = "CENTER"

        return {
            "label": label,
            "confidence": confidence
        }

    except Exception as e:
        logger.exception("Bias prediction failed.")
        raise Exception(str(e))