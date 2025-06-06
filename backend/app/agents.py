import os
import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from openai import AsyncAzureOpenAI
from .config import settings
from .models import AgentType, ChatResponse
from .services import mock_service

class AgentOrchestrator:
    """Multi-agent orchestrator using Azure OpenAI Responses API"""
    
    def __init__(self):
        # Validate the endpoint URL format first
        endpoint = settings.validate_endpoint()
        
        self.client = AsyncAzureOpenAI(
            azure_endpoint=endpoint,
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version
        )
        
        self.agent_configs = {
            AgentType.HR: {
                "name": "HR Specialist",
                "icon": "👥",
                "color": "#0078d4",
                "system_prompt": """You are a specialized HR assistant for a healthcare organization. 
                You help with policies, benefits, leave requests, expense reports, and employee questions.
                Always provide specific, helpful information and cite sources when possible.
                Be professional but friendly.""",
                "keywords": ["hr", "policy", "vacation", "leave", "benefits", "expense", "payroll", "onboarding", "handbook"]
            },
            AgentType.IT: {
                "name": "IT Support",
                "icon": "🔧",
                "color": "#107c10", 
                "system_prompt": """You are an IT support specialist for a healthcare organization.
                You help with technical issues, create tickets, troubleshoot problems, and provide solutions.
                Always create tickets for issues that need tracking and provide clear resolution steps.
                Be technical but accessible.""",
                "keywords": ["computer", "laptop", "slow", "password", "email", "network", "printer", "software", "database", "ticket"]
            },
            AgentType.TRAVEL: {
                "name": "Travel Coordinator", 
                "icon": "✈️",
                "color": "#d83b01",
                "system_prompt": """You are a travel coordinator for a healthcare organization.
                You help with travel policies, booking assistance, expense guidelines, and approval processes.
                Always reference current travel policies and provide specific per-diem rates.
                Be helpful and detail-oriented.""",
                "keywords": ["travel", "trip", "flight", "hotel", "conference", "per diem", "booking", "approval"]
            },
            AgentType.DOC_CHAT: {
                "name": "Document Analyst",
                "icon": "📄", 
                "color": "#5c2d91",
                "system_prompt": """You are a document analysis specialist.
                You analyze uploaded documents, extract key information, and answer questions about content.
                Always provide specific citations with page numbers when possible.
                Be thorough and accurate.""",
                "keywords": ["document", "file", "upload", "analyze", "pdf", "report", "research", "paper"]
            },
            AgentType.GENERAL: {
                "name": "Healthcare Assistant",
                "icon": "🏥",
                "color": "#0078d4",
                "system_prompt": """You are a general healthcare organization assistant.
                You provide company information, general guidance, and help users find the right resources.
                If a question requires specialized knowledge, recommend the appropriate specialist agent.
                Be welcoming and helpful.""",
                "keywords": ["general", "help", "company", "information", "guidance"]
            }
        }
        
        # Function definitions for agents
        self.function_definitions = [
            {
                "type": "function",
                "function": {
                    "name": "create_it_ticket",
                    "description": "Create an IT support ticket for technical issues",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string", "description": "Brief title of the issue"},
                            "description": {"type": "string", "description": "Detailed description of the problem"},
                            "priority": {"type": "string", "enum": ["low", "medium", "high", "critical"], "default": "medium"}
                        },
                        "required": ["title", "description"]
                    }
                }
            },
            {
                "type": "function", 
                "function": {
                    "name": "create_expense_report",
                    "description": "Create an expense report entry",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "amount": {"type": "number", "description": "Expense amount in USD"},
                            "category": {"type": "string", "description": "Expense category (meal, travel, supplies, etc.)"},
                            "description": {"type": "string", "description": "Description of the expense"}
                        },
                        "required": ["amount", "category", "description"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_hr_policies",
                    "description": "Search HR policies and procedures",
                    "parameters": {
                        "type": "object", 
                        "properties": {
                            "query": {"type": "string", "description": "Search query for policies"}
                        },
                        "required": ["query"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "check_travel_policy",
                    "description": "Check travel policies and guidelines",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "destination": {"type": "string", "description": "Travel destination"},
                            "duration": {"type": "string", "description": "Trip duration"}
                        },
                        "required": ["destination"]
                    }
                }
            }
        ]
    
    def detect_agent_intent(self, message: str) -> AgentType:
        """Detect which agent should handle the message based on keywords"""
        message_lower = message.lower()
        
        # Score each agent based on keyword matches
        scores = {}
        for agent_type, config in self.agent_configs.items():
            score = sum(1 for keyword in config["keywords"] if keyword in message_lower)
            scores[agent_type] = score
        
        # Return agent with highest score, default to GENERAL
        best_agent = max(scores.items(), key=lambda x: x[1])
        return best_agent[0] if best_agent[1] > 0 else AgentType.GENERAL
    
    async def execute_function(self, function_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent functions and return results"""
        try:
            if function_name == "create_it_ticket":
                ticket = mock_service.create_mock_ticket(
                    title=arguments["title"],
                    description=arguments["description"], 
                    priority=arguments.get("priority", "medium")
                )
                return {
                    "success": True,
                    "ticket": ticket.dict(),
                    "message": f"✅ IT Ticket {ticket.ticket_id} created successfully!"
                }
            
            elif function_name == "create_expense_report":
                expense = mock_service.create_mock_expense(
                    amount=arguments["amount"],
                    category=arguments["category"],
                    description=arguments["description"]
                )
                return {
                    "success": True,
                    "expense": expense,
                    "message": f"✅ Expense report {expense['expense_id']} submitted for approval!"
                }
            
            elif function_name == "search_hr_policies":
                policies = mock_service.get_hr_policies()
                # Simple keyword matching for demo
                query = arguments["query"].lower()
                relevant_policies = [p for p in policies if query in p["title"].lower() or query in p["content"].lower()]
                return {
                    "success": True,
                    "policies": relevant_policies[:3],  # Top 3 results
                    "total_found": len(relevant_policies)
                }
            
            elif function_name == "check_travel_policy":
                policies = mock_service.get_travel_policies()
                destination = arguments["destination"].lower()
                # Simple logic for demo
                policy = policies[1] if any(word in destination for word in ["international", "overseas", "europe", "asia"]) else policies[0]
                return {
                    "success": True,
                    "policy": policy,
                    "destination": arguments["destination"]
                }
            
            else:
                return {"success": False, "error": f"Unknown function: {function_name}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def chat(self, message: str, conversation_id: str = None) -> ChatResponse:
        """Main chat interface using Azure OpenAI Responses API"""
        try:
            # Detect intended agent
            detected_agent = self.detect_agent_intent(message)
            agent_config = self.agent_configs[detected_agent]
            
            # Prepare messages for Responses API
            system_prompt = agent_config["system_prompt"]
            
            # For demo purposes, we'll simulate the Responses API call
            # In production, you would use the actual Responses API
            response_content = await self._simulate_responses_api(
                message, system_prompt, detected_agent
            )
            
            # Generate sources based on agent type
            sources = self._generate_sources(detected_agent)
            
            # Generate suggested actions
            suggested_actions = self._generate_suggested_actions(detected_agent)
            
            return ChatResponse(
                message=response_content["content"],
                agent=detected_agent,
                conversation_id=conversation_id or f"conv_{int(asyncio.get_event_loop().time())}",
                sources=sources,
                suggested_actions=suggested_actions,
                metadata=response_content.get("metadata", {})
            )
            
        except Exception as e:
            # Fallback response
            return ChatResponse(
                message=f"I apologize, but I'm experiencing some technical difficulties. Please try again or contact IT support. Error: {str(e)[:100]}",
                agent=AgentType.GENERAL,
                conversation_id=conversation_id or "conv_error",
                sources=[],
                suggested_actions=["Try rephrasing your question", "Contact IT support"],
                metadata={"error": True}
            )
    
    async def _simulate_responses_api(self, message: str, system_prompt: str, agent_type: AgentType) -> Dict[str, Any]:
        """Use EYQ Incubator OpenAI API for chat responses"""
        
        try:
            # Check if EYQ Incubator credentials are set
            if not settings.azure_openai_endpoint or not settings.azure_openai_api_key:
                print("WARNING: EYQ Incubator credentials not configured in .env file")
                print("AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY must be set")
                raise ValueError("EYQ Incubator credentials not configured. Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in the .env file.")
            
            print(f"Calling EYQ Incubator API with endpoint: {settings.azure_openai_endpoint}")
            print(f"Using deployment: {settings.azure_openai_deployment_name}")
            
            # Validate endpoint URL format
            if "://" not in settings.azure_openai_endpoint:
                print("ERROR: Invalid endpoint format. Must include protocol (https://)")
                raise ValueError("Invalid endpoint format. Must include protocol (https://)")
                
            # Real EYQ Incubator API call
            response = await self.client.chat.completions.create(
                model=settings.azure_openai_deployment_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                temperature=0.7,
                max_tokens=800,
                tools=self.function_definitions if agent_type != AgentType.DOC_CHAT else None,
            )
            
            # Extract the response content
            response_content = response.choices[0].message.content
            
            # Check if there are function calls
            tool_calls = response.choices[0].message.tool_calls
            metadata = {"agent": agent_type.value, "azure_openai": True, "invoked_agent_reason": f"Selected {agent_type.value} agent based on message content analysis"}
            
            # Handle function calling if needed
            if tool_calls:
                function_name = tool_calls[0].function.name
                arguments = json.loads(tool_calls[0].function.arguments)
                
                # Execute the function
                function_result = await self.execute_function(function_name, arguments)
                metadata["function_called"] = function_name
                
                # Include function result in the response
                if function_result.get("success", False):
                    response_content = function_result.get("message", response_content)
                    metadata.update(function_result)
                
            print("Successfully received response from Azure OpenAI")
            return {
                "content": response_content,
                "metadata": metadata
            }
            
        except Exception as e:
            print(f"Azure OpenAI API error: {str(e)}")
            
            # Instead of falling back to simulated responses, return an error message that will be shown to the user
            error_msg = f"Error connecting to Azure OpenAI: {str(e)}"
            print(error_msg)
            
            # Return error message with troubleshooting steps instead of simulated response
            return {
                "content": f"⚠️ **EYQ Incubator Connection Issue**\n\nI'm unable to access EYQ Incubator API for responses. This is likely due to missing configuration. To fix this issue, please:\n\n1. Set your AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in the .env file with your EYQ Incubator credentials\n2. Ensure your EYQ Incubator service is provisioned and the deployment name '{settings.azure_openai_deployment_name}' exists\n3. Make sure the endpoint URL includes the protocol (https://)\n4. Restart the application after making changes\n\nError details: {str(e)}",
                "metadata": {"error": True, "azure_openai_error": True}
            }
            
            # Note: The following code is only kept for reference but will never execute
            # Agent-specific response templates for demo
            if agent_type == AgentType.IT:
                if any(word in message.lower() for word in ["slow", "computer", "performance", "issue", "technical", "password", "reset"]):
                    ticket = mock_service.create_mock_ticket("Slow computer performance", message)
                    return {
                        "content": f"I understand you're experiencing technical issues. I've created ticket **{ticket.ticket_id}** to track this issue.\n\n**Immediate troubleshooting steps:**\n1. Restart your computer\n2. Close unnecessary applications\n3. Clear your browser cache\n4. Run disk cleanup\n\n**Ticket Details:**\n- Status: {ticket.status}\n- Assigned to: {ticket.assigned_to}\n- Estimated resolution: {ticket.estimated_resolution}\n\nI'll monitor this ticket and update you on progress. Is there anything else I can help you with?",
                        "metadata": {"ticket_created": True, "ticket_id": ticket.ticket_id, "fallback": True}
                    }
                
            elif agent_type == AgentType.HR:
                if any(word in message.lower() for word in ["remote", "work from home", "policy", "hr", "benefit", "leave", "vacation", "policy"]):
                    return {
                        "content": "Based on our current **Remote Work Policy (v4.2)**, clinical staff may work remotely for administrative tasks up to 2 days per week with supervisor approval.\n\n**Key points:**\n- Administrative tasks only (no patient care)\n- Maximum 2 days per week\n- Requires supervisor approval\n- Must maintain HIPAA compliance\n- Home workspace security requirements apply\n\n**To request remote work:**\n1. Complete Form HR-101\n2. Get supervisor approval\n3. Submit to HR department\n\nWould you like me to help you start a remote work request?",
                        "metadata": {"policy_referenced": "Remote Work Policy v4.2"}
                    }
                
            elif agent_type == AgentType.TRAVEL:
                if any(word in message.lower() for word in ["travel", "trip", "conference", "flight", "hotel", "booking"]):
                    return {
                        "content": "I'd be happy to help with your travel needs! Here's our current **Travel Policy 2024**:\n\n**Domestic Travel:**\n- Per diem: $75/day\n- Hotel limit: $150/night\n- Manager approval required for trips > 3 days\n\n**International Travel:**\n- Per diem: $100/day  \n- Hotel limit: $200/night\n- VP approval required\n\n**Booking Process:**\n1. Get approval first\n2. Use Concur Travel platform\n3. Book within 14 days of approval\n4. Submit receipts within 30 days\n\nWhat type of travel are you planning? I can help you get started with the approval process.",
                        "metadata": {"policy_referenced": "Travel Policy 2024"}
                    }
            
            elif agent_type == AgentType.DOC_CHAT:
                return {
                    "content": "Hello! I'm your Document Analysis specialist. I can help you analyze uploaded documents, extract key information, and answer questions about their content.\n\n**I can analyze:**\n- PDF documents\n- Word documents (.docx)\n- Excel spreadsheets\n- Clinical research papers\n- Policy documents\n- Meeting notes\n\n**My capabilities:**\n- Content summarization\n- Key point extraction\n- Entity recognition\n- Question answering with citations\n- Document comparison\n\nTo get started, please upload a document using the upload button, or ask me any questions about document analysis!",
                    "metadata": {"agent": "doc_chat", "ready_for_upload": True}
                }
        
            # Default general assistant response - only return this for general agent type
            # For other agent types, provide more specific responses
            if agent_type == AgentType.GENERAL:
                return {
                    "content": f"Hello! I'm your Healthcare Assistant. I'm here to help you with various tasks and questions.\n\n**I can help you with:**\n- General company information\n- Directing you to the right specialist\n- Basic questions and guidance\n- Finding resources and contacts\n\n**For specialized help, I can connect you with:**\n- 👥 HR Specialist - Policies, benefits, leave requests\n- 🔧 IT Support - Technical issues, password resets\n- ✈️ Travel Coordinator - Travel policies and booking\n- 📄 Document Analyst - File analysis and document questions\n\nWhat can I help you with today?",
                    "metadata": {"agent": agent_type.value}
                }
            
            # For other agent types, provide a custom generic response for that agent
            agent_responses = {
                AgentType.IT: {
                    "content": "Hello! I'm your IT Support specialist. I can help with technical issues, system access, software problems, and equipment requests.\n\nWhat technical issue are you experiencing today?",
                    "metadata": {"agent": agent_type.value}
                },
                AgentType.HR: {
                    "content": "Hello! I'm your HR Specialist. I can help with policies, benefits, leave requests, and other HR-related questions.\n\nWhat HR question can I assist you with today?",
                    "metadata": {"agent": agent_type.value}
                },
                AgentType.TRAVEL: {
                    "content": "Hello! I'm your Travel Coordinator. I can help with booking trips, travel policies, expense reporting, and itinerary planning.\n\nHow can I assist with your travel needs today?",
                    "metadata": {"agent": agent_type.value}
                },
            }
            
            return agent_responses.get(agent_type, {
                "content": f"I'm the {agent_type.value} specialist. How can I help you today?",
                "metadata": {"agent": agent_type.value}
            })
    
    def _generate_sources(self, agent_type: AgentType) -> List[Dict[str, Any]]:
        """Generate realistic sources based on agent type"""
        if agent_type == AgentType.HR:
            return mock_service.get_sharepoint_sources()[:2]
        elif agent_type == AgentType.IT:
            return mock_service.get_servicenow_sources()[:2]
        elif agent_type == AgentType.TRAVEL:
            return [
                {
                    "title": "Corporate Travel Policy 2024",
                    "type": "SharePoint",
                    "url": "https://company.sharepoint.com/sites/finance/travel-policy",
                    "confidence": 0.96
                }
            ]
        else:
            return []
    
    def _generate_suggested_actions(self, agent_type: AgentType) -> List[str]:
        """Generate suggested follow-up actions"""
        actions = {
            AgentType.HR: [
                "View employee handbook",
                "Submit leave request", 
                "Create expense report",
                "Contact HR directly"
            ],
            AgentType.IT: [
                "Create IT ticket",
                "Check ticket status",
                "View IT knowledge base",
                "Contact help desk"
            ],
            AgentType.TRAVEL: [
                "Start travel request",
                "Check travel policies",
                "View approved vendors",
                "Contact travel team"
            ],
            AgentType.DOC_CHAT: [
                "Upload document",
                "Analyze another file",
                "Compare documents",
                "Export analysis"
            ],
            AgentType.GENERAL: [
                "Contact HR specialist",
                "Contact IT support", 
                "View company directory",
                "Access employee portal"
            ]
        }
        return actions.get(agent_type, [])

# Global orchestrator instance
orchestrator = AgentOrchestrator()
