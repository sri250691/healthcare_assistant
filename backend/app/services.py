from datetime import datetime, timedelta
import random
import string
from typing import Dict, List, Any
from .models import TicketResponse, ExpenseReport, DocumentAnalysis

class MockDataService:
    """Service for generating realistic demo data"""
    
    @staticmethod
    def generate_ticket_id() -> str:
        """Generate realistic IT ticket ID"""
        return f"IT-{random.randint(100000, 999999)}"
    
    @staticmethod
    def generate_expense_id() -> str:
        """Generate realistic expense report ID"""
        return f"EXP-{random.randint(10000, 99999)}"
    
    @staticmethod
    def get_hr_policies() -> List[Dict[str, Any]]:
        """Mock HR policy database"""
        return [
            {
                "title": "Remote Work Policy",
                "category": "work_arrangements",
                "content": "Clinical staff may work remotely for administrative tasks up to 2 days per week with supervisor approval.",
                "source": "Employee Handbook v4.2",
                "last_updated": "2024-03-15"
            },
            {
                "title": "Vacation Policy",
                "category": "time_off",
                "content": "Full-time employees accrue 15 days PTO annually, increasing to 20 days after 5 years of service.",
                "source": "HR Policy Manual Section 3.1",
                "last_updated": "2024-01-10"
            },
            {
                "title": "HIPAA Compliance Training",
                "category": "training",
                "content": "All staff must complete HIPAA training annually. Next deadline: December 31, 2024.",
                "source": "Compliance Training Portal",
                "last_updated": "2024-06-01"
            }
        ]
    
    @staticmethod
    def get_it_knowledge_base() -> List[Dict[str, Any]]:
        """Mock IT support knowledge base"""
        return [
            {
                "issue": "Slow computer performance",
                "solution": "1. Restart computer 2. Clear browser cache 3. Run disk cleanup 4. Check for malware",
                "category": "performance",
                "source": "IT Support Wiki",
                "success_rate": "85%"
            },
            {
                "issue": "Cannot access patient database",
                "solution": "Check VPN connection, verify credentials, contact IT if problem persists",
                "category": "access",
                "source": "Critical Systems Guide",
                "success_rate": "92%"
            },
            {
                "issue": "Email not syncing",
                "solution": "Sign out and back into Outlook, check internet connection, restart email app",
                "category": "email",
                "source": "Email Troubleshooting Guide",
                "success_rate": "78%"
            }
        ]
    
    @staticmethod
    def get_travel_policies() -> List[Dict[str, Any]]:
        """Mock travel policy database"""
        return [
            {
                "destination_type": "domestic",
                "per_diem": "$75/day",
                "hotel_limit": "$150/night",
                "approval_required": "Manager approval for trips > 3 days",
                "source": "Travel Policy 2024",
                "booking_platform": "Concur Travel"
            },
            {
                "destination_type": "international",
                "per_diem": "$100/day",
                "hotel_limit": "$200/night", 
                "approval_required": "VP approval required",
                "source": "International Travel Guidelines",
                "booking_platform": "Corporate Travel Agency"
            }
        ]
    
    @staticmethod
    def create_mock_ticket(title: str, description: str, priority: str = "medium") -> TicketResponse:
        """Create mock IT ticket"""
        ticket_id = MockDataService.generate_ticket_id()
        
        # Mock assignment based on category
        assigned_to = random.choice([
            "IT Support Team Alpha",
            "Network Operations",
            "Help Desk Level 2",
            "System Administrator"
        ])
        
        # Mock resolution time based on priority
        resolution_hours = {"low": 24, "medium": 8, "high": 4, "critical": 1}
        hours = resolution_hours.get(priority, 8)
        
        return TicketResponse(
            ticket_id=ticket_id,
            status="Open",
            created_at=datetime.now(),
            estimated_resolution=f"{hours} hours",
            assigned_to=assigned_to
        )
    
    @staticmethod
    def create_mock_expense(amount: float, category: str, description: str) -> Dict[str, Any]:
        """Create mock expense report"""
        expense_id = MockDataService.generate_expense_id()
        
        return {
            "expense_id": expense_id,
            "amount": amount,
            "category": category,
            "description": description,
            "status": "Pending Approval",
            "submitted_date": datetime.now().isoformat(),
            "approver": "Sarah Johnson (Finance Manager)",
            "expected_approval": "3-5 business days"
        }
    
    @staticmethod
    def get_sharepoint_sources() -> List[Dict[str, Any]]:
        """Mock SharePoint document sources"""
        return [
            {
                "title": "Employee Handbook 2024",
                "url": "https://company.sharepoint.com/sites/hr/handbook",
                "type": "SharePoint",
                "last_modified": "2024-03-15",
                "confidence": 0.95
            },
            {
                "title": "IT Security Policies",
                "url": "https://company.sharepoint.com/sites/it/security",
                "type": "SharePoint", 
                "last_modified": "2024-05-20",
                "confidence": 0.88
            },
            {
                "title": "Clinical Protocols Manual",
                "url": "https://company.sharepoint.com/sites/clinical/protocols",
                "type": "SharePoint",
                "last_modified": "2024-04-10",
                "confidence": 0.92
            }
        ]
    
    @staticmethod
    def get_servicenow_sources() -> List[Dict[str, Any]]:
        """Mock ServiceNow knowledge articles"""
        return [
            {
                "title": "Password Reset Procedures",
                "article_id": "KB0001234",
                "type": "ServiceNow",
                "category": "IT Support",
                "last_updated": "2024-05-15",
                "confidence": 0.97
            },
            {
                "title": "Equipment Request Process",
                "article_id": "KB0005678",
                "type": "ServiceNow",
                "category": "Facilities",
                "last_updated": "2024-04-22",
                "confidence": 0.89
            },
            {
                "title": "HIPAA Incident Reporting",
                "article_id": "KB0009876",
                "type": "ServiceNow",
                "category": "Compliance",
                "last_updated": "2024-06-01",
                "confidence": 0.94
            }
        ]

# Global instance
mock_service = MockDataService()
