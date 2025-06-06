#!/bin/bash

# Test EYQ Incubator API Connection
# This script tests the connection to the EYQ Incubator API before running the application

echo "==============================================="
echo "Healthcare Chatbot - EYQ Incubator Connection Test"
echo "==============================================="
echo ""

# Check if python environment is available
if [ ! -d "backend/venv" ]; then
  echo "❌ Python virtual environment not found!"
  echo "Please run setup.sh first to create the virtual environment."
  exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Activate virtual environment
source venv/bin/activate

# Install necessary packages for the test
pip install -q python-dotenv openai

# Run the test
cat > test_api.py << 'EOF'
import os
import sys
from dotenv import load_dotenv
from openai import AzureOpenAI

def test_connection():
    print("Loading environment variables...")
    load_dotenv()
    
    # Get credentials from environment
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    
    # Check if they exist
    if not endpoint or not api_key:
        print("❌ Missing credentials in .env file!")
        print("Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY")
        return False
    
    print(f"Using endpoint: {endpoint[:30]}...")
    print(f"Using model deployment: {deployment}")
    
    try:
        # Create client
        client = AzureOpenAI(
            azure_endpoint=endpoint,
            api_key=api_key,
            api_version=api_version
        )
        
        # Simple test chat completion
        test_message = "Hello, this is a test message to verify the EYQ Incubator connection."
        print(f"\nSending test message: '{test_message}'")
        
        response = client.chat.completions.create(
            model=deployment,
            messages=[
                {"role": "system", "content": "You are a helpful healthcare assistant. Respond with just a brief greeting."},
                {"role": "user", "content": test_message}
            ],
            temperature=0.7,
            max_tokens=50
        )
        
        # Extract and display the response
        answer = response.choices[0].message.content.strip()
        print("\n✅ Connection successful!")
        print(f"Response from EYQ Incubator: '{answer}'")
        return True
    
    except Exception as e:
        print(f"\n❌ Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
EOF

# Run the test
python test_api.py

# Check if the test was successful
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ EYQ Incubator connection test successful!"
  echo "You can now run the application with ./run-demo.sh"
else
  echo ""
  echo "❌ EYQ Incubator connection test failed!"
  echo "Please check your credentials and try again."
  echo "See the error message above for more details."
fi

# Clean up
rm test_api.py

# Deactivate virtual environment
deactivate

echo "==============================================="
