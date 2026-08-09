from fastapi import APIRouter, HTTPException

from app.schemas.prediction import (
    PredictionRequest,
    SentimentResponse,
    SubjectivityResponse,
    ClickbaitResponse,
    BiasResponse,
    AnalyzeResponse
)

from app.services.sentiment_service import analyze_sentiment
from app.services.subjectivity_service import analyze_subjectivity
from app.services.clickbait_service import analyze_clickbait
from app.services.bias_service import analyze_bias

router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)


@router.post(
    "/sentiment",
    response_model=SentimentResponse
)
def predict_sentiment(request: PredictionRequest):

    try:

        prediction = analyze_sentiment(request.text)

        return SentimentResponse(
            label=prediction["label"],
            score=prediction["score"]
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post(
    "/subjectivity",
    response_model=SubjectivityResponse
)
def predict_subjectivity(request: PredictionRequest):

    try:

        prediction = analyze_subjectivity(request.text)

        return SubjectivityResponse(
            subjectivity=prediction["subjectivity"]
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post(
    "/clickbait",
    response_model=ClickbaitResponse
)
def predict_clickbait(request: PredictionRequest):

    try:

        prediction = analyze_clickbait(request.text)

        return ClickbaitResponse(
            probability=prediction["probability"],
            is_clickbait=prediction["is_clickbait"]
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post(
    "/bias",
    response_model=BiasResponse
)
def predict_bias(request: PredictionRequest):

    try:

        prediction = analyze_bias(request.text)

        return BiasResponse(
            label=prediction["label"],
            confidence=prediction["confidence"]
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post(
    "/analyze",
    response_model=AnalyzeResponse
)
def analyze_article(request: PredictionRequest):

    try:

        sentiment = analyze_sentiment(request.text)

        subjectivity = analyze_subjectivity(request.text)

        clickbait = analyze_clickbait(request.text)

        bias = analyze_bias(request.text)

        return AnalyzeResponse(

            sentiment=SentimentResponse(
                label=sentiment["label"],
                score=sentiment["score"]
            ),

            subjectivity=SubjectivityResponse(
                subjectivity=subjectivity["subjectivity"]
            ),

            clickbait=ClickbaitResponse(
                probability=clickbait["probability"],
                is_clickbait=clickbait["is_clickbait"]
            ),

            bias=BiasResponse(
                label=bias["label"],
                confidence=bias["confidence"]
            )

        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )