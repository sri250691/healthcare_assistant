#!/bin/bash

echo "🚀 Starting Healthcare Multi-Agent Demo..."

# Check if .env is configured
if [ ! -f "backend/.env" ] || [ ! -s "backend/.env" ]; then
    echo "❌ Backend .env file not found or empty!"
    echo "Please configure your Azure OpenAI credentials by running:"
    echo "./configure-azure-openai.sh"
    exit 1
fi

# Check if EYQ Incubator credentials are set
AZURE_ENDPOINT=$(grep -E "^AZURE_OPENAI_ENDPOINT=" backend/.env | cut -d= -f2)
AZURE_API_KEY=$(grep -E "^AZURE_OPENAI_API_KEY=" backend/.env | cut -d= -f2)

if [ -z "$AZURE_ENDPOINT" ] || [ -z "$AZURE_API_KEY" ]; then
    echo "⚠️ Warning: EYQ Incubator credentials are not set in backend/.env"
    echo "The demo will run but will display error messages instead of AI responses."
    echo ""
    echo "To configure EYQ Incubator credentials, please run:"
    echo "./configure-azure-openai.sh"
    echo ""
    echo "Press Enter to continue anyway, or Ctrl+C to cancel..."
    read -r
elif [[ "$AZURE_ENDPOINT" != *"://"* ]]; then
    echo "⚠️ Warning: EYQ Incubator endpoint URL format may be invalid"
    echo "The system will attempt to add 'https://' prefix if needed."
    echo ""
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Start backend
echo "🔧 Starting FastAPI backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup.sh first."
    exit 1
fi

source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

cd ..

# Start frontend
echo "🎨 Starting React frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 Demo is starting up!"
echo ""
echo "📍 Backend API: http://localhost:8000"
echo "📍 Frontend App: http://localhost:5173"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "⏳ Waiting for servers to start..."
sleep 5

# Try to open browser
if command_exists open; then
    echo "🌐 Opening browser..."
    open http://localhost:5173
elif command_exists xdg-open; then
    echo "🌐 Opening browser..."
    xdg-open http://localhost:5173
fi

echo ""
echo "✅ Demo is ready!"
echo ""
echo "📝 Demo Features:"
echo "   • Multi-agent orchestration with visual switching"
echo "   • 5 specialized agents (HR, IT, Travel, DocChat, General)"
echo "   • Document upload and analysis"
echo "   • Realistic mock data and ticket creation"
echo "   • Source attribution and chat history"
echo ""
echo "🛑 To stop the demo, press Ctrl+C"
echo ""

# Wait for Ctrl+C
trap "echo '🛑 Stopping demo...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Keep script running
wait
