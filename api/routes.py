from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.parser import DocumentProcessor
from agents.screener import ScreeningAgent
from utils.logger import logger
import uuid

router = APIRouter(prefix="/v1", tags=["Screening"])
agent = ScreeningAgent()


@router.post("/screen")
async def screen_cv(
        file: UploadFile = File(...),
        job_description: str = Form(...)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    request_id = str(uuid.uuid4())
    logger.info("request_received", request_id=request_id, filename=file.filename)

    content = await file.read()
    cv_markdown = await DocumentProcessor.process_cv(content)

    try:
        candidate_result = await agent.screen(cv_markdown, job_description)
        return {"request_id": request_id, "data": candidate_result}
    except Exception as e:
        logger.error("screening_failed", request_id=request_id, error=str(e))
        return {"error": "Processing failed", "details": str(e)}