from typing import List, Dict
from datetime import datetime
from core.models import Report, ReportCreate

# In-memory storage for demo (replace with database in production)
reports_db: Dict[str, Report] = {}


def generate_id() -> str:
    """Generate a unique report ID"""
    return f"report_{int(datetime.now().timestamp() * 1000)}"


def create_report(report_data: ReportCreate) -> Report:
    """Create a new report"""
    report_id = generate_id()
    report = Report(id=report_id, **report_data.model_dump())
    reports_db[report_id] = report
    return report


def get_all_reports() -> List[Report]:
    """Get all reports sorted by timestamp"""
    reports = list(reports_db.values())
    reports.sort(key=lambda x: x.timestamp, reverse=True)
    return reports


def get_report(report_id: str) -> Report | None:
    """Get a specific report by ID"""
    return reports_db.get(report_id)


def get_analytics() -> dict:
    """Generate analytics from reports"""
    reports = list(reports_db.values())
    
    by_domain = {}
    by_severity = {}
    by_language = {}
    
    for report in reports:
        # Count by domain
        by_domain[report.domain] = by_domain.get(report.domain, 0) + 1
        
        # Count by severity
        by_severity[report.severity] = by_severity.get(report.severity, 0) + 1
        
        # Count by language
        by_language[report.language] = by_language.get(report.language, 0) + 1
    
    # Get recent reports (last 10)
    recent = sorted(reports, key=lambda x: x.timestamp, reverse=True)[:10]
    
    return {
        "total_reports": len(reports),
        "by_domain": by_domain,
        "by_severity": by_severity,
        "by_language": by_language,
        "recent_reports": recent
    }
