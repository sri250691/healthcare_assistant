from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AgentType(str, Enum):
    GENERAL = "general"
    HR = "hr"
    IT = "it"
    TRAVEL = "travel"
    DOC_CHAT = "doc_chat"

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    agent: Optional[AgentType] = None
    timestamp: Optional[datetime] = None
    sources: Optional[List[Dict[str, Any]]] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    agent_hint: Optional[AgentType] = None

class ChatResponse(BaseModel):
    message: str
    agent: AgentType
    conversation_id: str
    sources: List[Dict[str, Any]] = []
    suggested_actions: List[str] = []
    metadata: Dict[str, Any] = {}

class TicketRequest(BaseModel):
    title: str
    description: str
    priority: str = "medium"
    category: str = "general"

class TicketResponse(BaseModel):
    ticket_id: str
    status: str
    created_at: datetime
    estimated_resolution: str
    assigned_to: str

class ExpenseReport(BaseModel):
    amount: float
    category: str
    description: str
    date: datetime
    receipt_url: Optional[str] = None

class DocumentAnalysis(BaseModel):
    filename: str
    content_summary: str
    key_points: List[str]
    entities: List[Dict[str, str]]
    sources: List[Dict[str, Any]]
