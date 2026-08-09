from fastapi import APIRouter

router = APIRouter(
    prefix="",
    tags=["Health"]
)

@router.get("/")
def root():
    return {
        "message": "AI News Bias Detector ML Service is running"
    }


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ML Service"
    }