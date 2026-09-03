import os
import asyncio
import json
from dotenv import load_dotenv
from smolagents import LiteLLMModel, CodeAgent
from models.schemas import Candidate
from agents.tools import calculate_experience, skill_match_validator
from utils.logger import logger

load_dotenv()


class ScreeningAgent:
    def __init__(self):
        # groq/llama-3.3-70b-versatile was removed from Groq's catalog (model_not_found).
        # gpt-oss-120b is excluded: it intermittently calls a native tool instead of
        # writing code, which CodeAgent's code-only mode rejects (~40% failure rate).
        groq_key = os.getenv("GROQ_API_KEY")
        self.model_configs = [
            {"id": "groq/qwen/qwen3.8-27b", "api_key": groq_key},
            {"id": "groq/qwen/qwen3.6-27b", "api_key": groq_key},
            ]

    async def screen(self, cv_text: str, jd_text: str) -> Candidate:
        prompt = f"""
                Extract information from this candidate's CV and the job description below.
                Do NOT calculate years of experience or a match score yourself — just extract
                the raw facts. Return ONLY a JSON object with this exact structure:
                {{
                    "name": "Full Name",
                    "email": "Email Address",
                    "employment_periods": [
                        {{"organization": "Employer Name", "start_date": "YYYY-MM", "end_date": "YYYY-MM or present"}}
                    ],
                    "primary_skills": ["skill1", "skill2"],
                    "required_skills": ["skill1", "skill2"],
                    "reasoning": "1-sentence summary of the candidate's fit for the role"
                }}

                - employment_periods: paid/professional roles from the CV's work experience
                  section ONLY, with start/end dates as found there. Do NOT include education,
                  degree programs, certifications, or academic dates — those are not employment.
                - primary_skills: technical skills found in the CV.
                - required_skills: technical skills required by the job description.

                JD: {jd_text}
                CV: {cv_text[:4000]}
                """

        for config in self.model_configs:
            if not config["api_key"]:
                continue

            try:
                logger.info(f"Attempting screening with model: {config['id']}")

                current_model = LiteLLMModel(
                    model_id=config["id"],
                    api_key=config["api_key"]
                )

                agent = CodeAgent(
                    tools=[],
                    model=current_model,
                    additional_authorized_imports=["json"],
                    max_steps=4
                )

                raw_result = agent.run(prompt)

                if isinstance(raw_result, dict):
                    extracted = raw_result
                else:
                    clean_str = str(raw_result).replace("```json", "").replace("```", "").strip()
                    extracted = json.loads(clean_str.replace("'", '"'))

                years_of_experience = calculate_experience(extracted["employment_periods"])
                match = skill_match_validator(extracted["primary_skills"], extracted["required_skills"])

                return Candidate(
                    name=extracted["name"],
                    email=extracted["email"],
                    years_of_experience=years_of_experience,
                    primary_skills=extracted["primary_skills"],
                    match_score=round(match["score"]),
                    reasoning=extracted["reasoning"],
                )

            except Exception as e:
                logger.warning(f"Model {config['id']} failed. Error: {str(e)}")
                await asyncio.sleep(1)
                continue

        raise RuntimeError("All AI models failed or are unavailable.")
