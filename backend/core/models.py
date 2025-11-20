from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class Report(BaseModel):
    id: str
    timestamp: int
    audio_duration: float
    language: str
    transcription: str
    domain: str
    severity: str
    issue: str
    location: str
    entities: List[str]
    summary_local: str
    summary_en: str
    synced: bool = False


class ReportCreate(BaseModel):
    timestamp: int
    audio_duration: float
    language: str
    transcription: str
    domain: str
    severity: str
    issue: str
    location: str
    entities: List[str]
    summary_local: str
    summary_en: str


class AnalyticsResponse(BaseModel):
    total_reports: int
    by_domain: dict
    by_severity: dict
    by_language: dict
    recent_reports: List[Report]


class HealthResponse(BaseModel):
    status: str
    timestamp: str
