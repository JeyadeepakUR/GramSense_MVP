from fastapi import APIRouter, HTTPException, status
from typing import List
from core.models import Report, ReportCreate, AnalyticsResponse
from core.database import (
    create_report,
    get_all_reports,
    get_report,
    get_analytics
)

router = APIRouter(prefix="/api", tags=["reports"])


@router.post("/reports", response_model=Report, status_code=status.HTTP_201_CREATED)
async def ingest_report(report: ReportCreate):
    """
    Ingest a new report from the mobile client.
    This endpoint is called when the user confirms their report.
    """
    try:
        new_report = create_report(report)
        return new_report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create report: {str(e)}"
        )


@router.get("/reports", response_model=List[Report])
async def list_reports():
    """
    Get all reports sorted by timestamp (newest first).
    """
    reports = get_all_reports()
    return reports


@router.get("/reports/{report_id}", response_model=Report)
async def get_report_detail(report_id: str):
    """
    Get a specific report by ID.
    """
    report = get_report(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report {report_id} not found"
        )
    return report


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_report_analytics():
    """
    Get analytics dashboard data including:
    - Total reports
    - Distribution by domain
    - Distribution by severity
    - Distribution by language
    - Recent reports
    """
    analytics = get_analytics()
    return analytics
