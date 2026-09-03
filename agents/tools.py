from datetime import datetime
from dateutil import parser

EDUCATION_KEYWORDS = (
    "university", "college", "institute", "academy", "school", "faculty",
)


def calculate_experience(employment_periods: list[dict]) -> float:
    """Total years of experience from a list of {organization, start_date, end_date} periods
    (end_date may be 'present').

    Periods whose organization name matches EDUCATION_KEYWORDS are excluded regardless of how
    the caller labeled them, so a university period never counts as work experience even if
    it's misclassified upstream. Overlapping/concurrent periods are merged before summing, so
    holding two jobs at once doesn't double-count that time.
    """
    intervals = []
    for period in employment_periods:
        organization = (period.get("organization") or "").lower()
        if any(keyword in organization for keyword in EDUCATION_KEYWORDS):
            continue

        start = parser.parse(period['start_date'])
        end_str = period.get('end_date')
        if end_str and end_str.lower() != 'present':
            end = parser.parse(end_str)
        else:
            end = datetime.now()
        intervals.append((start, end))

    intervals.sort(key=lambda i: i[0])

    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))

    total_months = sum(
        (end.year - start.year) * 12 + (end.month - start.month)
        for start, end in merged
    )

    return round(total_months / 12, 1)


def skill_match_validator(candidate_skills: list, required_skills: list) -> dict:
    """Compares candidate_skills against required_skills, returning {"overlap": [...], "score": <0-100>}."""
    found = []
    req_lower =[r.lower() for r in required_skills]
    for skill in candidate_skills:
        skill_lower = skill.lower()

        for req in req_lower:
            if req in skill_lower:
                found.append(skill)
                break

    if len(required_skills) > 0: score = len(found) / len(required_skills) * 100
    else: score = 0




    return {"overlap": found, "score": min(score, 100)}
