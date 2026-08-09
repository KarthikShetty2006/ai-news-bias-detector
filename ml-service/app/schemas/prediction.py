from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=10,
        description="News article content to analyze"
    )


class SentimentResponse(BaseModel):
    label: str
    score: float


class SubjectivityResponse(BaseModel):
    subjectivity: float


class ClickbaitResponse(BaseModel):
    probability: float
    is_clickbait: bool


class BiasResponse(BaseModel):
    label: str
    confidence: float

class AnalyzeResponse(BaseModel):
    sentiment: SentimentResponse
    subjectivity: SubjectivityResponse
    clickbait: ClickbaitResponse
    bias: BiasResponse