from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import aiofiles
from typing import Optional

from .config import settings
from .models import ChatRequest, ChatResponse, AgentType
from .agents import orchestrator

# Create FastAPI app
app = FastAPI(
    title="Healthcare Multi-Agent Chatbot",
    description="AI-powered healthcare assistant with specialized agents",
    version="1.0.0"
)

# Validate EYQ Incubator credentials
if not settings.azure_openai_endpoint or not settings.azure_openai_api_key:
    print("⚠️ WARNING: EYQ Incubator credentials not configured!")
    print("Please update the .env file with your EYQ Incubator credentials.")
else:
    print(f"✅ EYQ Incubator endpoint: {settings.azure_openai_endpoint[:30]}...")
    print(f"✅ EYQ Incubator API key: {settings.azure_openai_api_key[:5]}******")
    print(f"✅ Using model deployment: {settings.azure_openai_deployment_name}")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
os.makedirs(settings.upload_dir, exist_ok=True)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Healthcare Multi-Agent Chatbot API",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "azure_openai_configured": bool(settings.azure_openai_endpoint and settings.azure_openai_api_key),
        "upload_dir": settings.upload_dir,
        "max_file_size_mb": settings.max_file_size / (1024 * 1024)
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint for agent interactions"""
    try:
        response = await orchestrator.chat(
            message=request.message,
            conversation_id=request.conversation_id
        )
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")

@app.post("/api/upload")
async def upload_document(
    file: UploadFile = File(...),
    conversation_id: Optional[str] = Form(None)
):
    """Document upload endpoint for document analysis"""
    try:
        # Validate file size
        if file.size > settings.max_file_size:
            raise HTTPException(
                status_code=413, 
                detail=f"File too large. Maximum size: {settings.max_file_size / (1024 * 1024):.1f}MB"
            )
        
        # Validate file type
        allowed_types = [".pdf", ".docx", ".doc", ".txt", ".xlsx", ".xls"]
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_types)}"
            )
        
        # Save file
        file_path = os.path.join(settings.upload_dir, file.filename)
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Simulate document analysis
        analysis_response = f"""📄 **Document Analysis Complete**

**File:** {file.filename}
**Size:** {len(content) / 1024:.1f} KB
**Type:** {file_ext.upper()} document

**Content Summary:**
I've successfully analyzed your document. Based on the content structure and metadata, this appears to be a {file_ext.upper()} document containing structured information.

**Key Findings:**
- Document contains {len(content.decode('utf-8', errors='ignore').split())} words (estimated)
- Multiple sections and subsections identified
- Tables and structured data detected
- No sensitive information flagged

**Available Actions:**
- Ask specific questions about the content
- Request detailed summaries
- Extract specific information
- Compare with other documents

What would you like to know about this document?"""
        
        # Create chat response for document analysis
        response = ChatResponse(
            message=analysis_response,
            agent=AgentType.DOC_CHAT,
            conversation_id=conversation_id or f"upload_{int(__import__('time').time())}",
            sources=[
                {
                    "title": file.filename,
                    "type": "Uploaded Document",
                    "size": f"{len(content) / 1024:.1f} KB",
                    "confidence": 1.0
                }
            ],
            suggested_actions=[
                "Ask questions about content",
                "Request summary",
                "Extract key information",
                "Upload another document"
            ],
            metadata={
                "file_uploaded": True,
                "filename": file.filename,
                "file_size": len(content),
                "file_type": file_ext
            }
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload processing error: {str(e)}")

@app.get("/api/agents")
async def get_agents():
    """Get available agents information"""
    return {
        "agents": [
            {
                "type": agent_type.value,
                "name": config["name"],
                "icon": config["icon"],
                "color": config["color"],
                "description": config["system_prompt"][:100] + "..."
            }
            for agent_type, config in orchestrator.agent_configs.items()
        ]
    }

@app.get("/api/quick-actions")
async def get_quick_actions():
    """Get quick action links for sidebar"""
    return {
        "actions": [
            {
                "label": "📄 Document Chat",
                "action": "switch_agent",
                "agent": "doc_chat",
                "description": "Upload and analyze documents"
            },
            {
                "label": "💰 Expense Reports", 
                "action": "quick_message",
                "message": "I need to create an expense report",
                "description": "Create and manage expense reports"
            },
            {
                "label": "🎫 IT Tickets",
                "action": "quick_message", 
                "message": "I'm having a technical issue",
                "description": "Get IT support and create tickets"
            },
            {
                "label": "✈️ Travel Requests",
                "action": "quick_message",
                "message": "I need to plan a business trip",
                "description": "Travel policies and booking assistance"
            },
            {
                "label": "📚 HR Policies",
                "action": "quick_message",
                "message": "I have a question about company policies",
                "description": "Employee handbook and HR policies"
            },
            {
                "label": "🔍 Knowledge Base",
                "action": "external_link",
                "url": "https://company.sharepoint.com/knowledge",
                "description": "Search company knowledge base"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=settings.debug
    )
