# Healthcare Multi-Agent Chatbot Demo 🏥

A sophisticated AI-powered healthcare assistant demonstrating multi-agent orchestration using Azure OpenAI Responses API, FastAPI, and React.

## ✨ Features

### 🤖 Multi-Agent Orchestration
- **5 Specialized Agents**: HR, IT Support, Travel, Document Analysis, General Assistant
- **Intelligent Routing**: Automatic agent selection based on user intent
- **Visual Agent Switching**: Smooth transitions with animated icons and colors
- **Context Preservation**: Maintains conversation context across agent handoffs

### 💼 Healthcare Enterprise Capabilities
- **IT Support**: Ticket creation, troubleshooting, password resets
- **HR Specialist**: Policy Q&A, expense reports, leave requests
- **Travel Coordinator**: Travel policies, booking assistance, approvals
- **Document Analyst**: Upload/analyze PDFs, Word docs, Excel files
- **General Assistant**: Company info, resource guidance

### 🎨 Modern User Interface
- **Responsive Design**: Optimized for demos and presentations
- **Real-time Animations**: Framer Motion powered transitions
- **Quick Actions Sidebar**: Easy access to common tasks
- **Chat History Panel**: Conversation management and sources
- **Source Attribution**: Transparent AI responses with citations

### 🔧 Technical Stack
- **Backend**: FastAPI with EYQ Incubator API
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **AI**: EYQ Incubator GPT-4o with function calling
- **Dev Tools**: Vite, ESLint, Hot reload

## 🚀 Setup and Configuration

### EYQ Incubator Setup (Required)
1. Obtain your EYQ Incubator endpoint URL and API key
2. Ensure you have access to a compatible model (e.g., GPT-4o)
3. Run the configuration helper script to set up your credentials:
   ```bash
   ./configure-azure-openai.sh
   ```
4. Enter your EYQ Incubator endpoint URL and API key when prompted

> **Note**: The demo requires valid EYQ Incubator credentials to work properly. Without these, the chatbot will display error messages instead of AI-generated responses.

## 🚀 Quick Start

### Prerequisites
- macOS (optimized for MacBook Pro M1)
- Python 3.11+
- Node.js 18+
- Azure OpenAI account with Responses API access

### 1. Setup
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Configure Azure OpenAI
```bash
# Edit backend/.env with your Azure OpenAI credentials
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
```

### 3. Run Demo
```bash
./run-demo.sh
```

The demo will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎯 Demo Scenarios

### IT Support Flow
1. **User**: "My computer is running slow"
2. **System**: *Switches to IT Agent* 🔧
3. **Response**: Creates ticket IT-001234 with troubleshooting steps

### HR Policy Question
1. **User**: "What's our remote work policy?"
2. **System**: *Switches to HR Agent* 👥
3. **Response**: Provides policy with source citations

### Document Analysis
1. **User**: Clicks "Document Chat" → uploads PDF
2. **System**: *Switches to Document Agent* 📄
3. **Response**: Analyzes content with key insights

### Travel Planning
1. **User**: "I need to plan a business trip"
2. **System**: *Switches to Travel Agent* ✈️
3. **Response**: Provides policies and booking guidance

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │────│  FastAPI Backend │────│ Azure OpenAI    │
│   - Agent UI     │    │  - Agent Router  │    │ Responses API   │
│   - Chat History │    │  - Function Defs │    │ - GPT-4o        │
│   - File Upload  │    │  - Mock Services │    │ - Built-in Tools│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
healthcare-chatbot-demo/
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── agents.py       # Agent orchestrator
│   │   ├── models.py       # Pydantic models
│   │   ├── services.py     # Mock data services
│   │   └── config.py       # Configuration
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilities
│   ├── package.json       # Node dependencies
│   └── vite.config.ts     # Vite configuration
├── setup.sh              # Complete setup script
├── run-demo.sh           # Start demo servers
└── README.md             # This file
```

## 🔧 Development

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Adding New Agents
1. Add agent type to `models.py`
2. Configure agent in `agents.py`
3. Add UI config in `utils/agentConfig.ts`
4. Test with sample queries

## 🎬 Demo Tips

### For Successful Presentations
1. **Start with General Questions**: Show basic interaction first
2. **Demonstrate Agent Switching**: Use queries that trigger different agents
3. **Show File Upload**: Upload a sample document for analysis
4. **Highlight Visual Transitions**: Point out agent icon changes
5. **Emphasize Sources**: Show how responses include citations

### Sample Demo Script
```
"Hi, I'm having issues with my computer running slowly"
→ Watch IT Agent activation and ticket creation

"What's our company policy on remote work?"
→ See HR Agent provide policy with sources

"I need to upload this quarterly report for analysis"
→ Upload file and show Document Agent analysis

"I want to plan a trip to the medical conference"
→ Travel Agent provides policies and guidance
```

### Troubleshooting
- **Azure OpenAI Issues**: Check endpoint and API key in backend/.env
- **Port Conflicts**: Ensure ports 8000 and 5173 are available
- **Module Errors**: Run setup.sh again to reinstall dependencies
- **File Upload Issues**: Check uploads/ directory permissions

## 📞 Support

For demo support or questions:
- Check the `/health` endpoint for backend status
- View browser console for frontend debugging
- Test API endpoints at `/docs` for backend issues

## 🔒 Security Notes

- This is a demo system with mock data
- Configure proper authentication for production use
- Implement proper file validation for uploads
- Use environment variables for all secrets

---

**Built for healthcare enterprise demos showcasing Microsoft's multi-agent AI capabilities** 🚀
