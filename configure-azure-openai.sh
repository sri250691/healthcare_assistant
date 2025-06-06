#!/bin/bash

# Healthcare Chatbot Demo - EYQ Incubator Configuration Helper
# This script helps set up EYQ Incubator credentials for the demo

echo "==============================================="
echo "Healthcare Chatbot Demo - EYQ Incubator Configuration"
echo "==============================================="
echo ""
echo "This script will help you configure the EYQ Incubator credentials"
echo "for the healthcare chatbot demo."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if .env file exists, create if not
if [ ! -f .env ]; then
  echo "Creating new .env file..."
  cp .env.example .env 2>/dev/null || touch .env
fi

# Ask for EYQ Incubator credentials
echo "Please enter your EYQ Incubator endpoint URL:"
echo "(Example: https://eyq-incubator.yourdomain.com)"
read -p "> " AZURE_OPENAI_ENDPOINT

# Ensure URL has proper format
if [[ "$AZURE_OPENAI_ENDPOINT" != "" && "$AZURE_OPENAI_ENDPOINT" != *"://"* ]]; then
  AZURE_OPENAI_ENDPOINT="https://$AZURE_OPENAI_ENDPOINT"
  echo "Added https:// prefix to endpoint: $AZURE_OPENAI_ENDPOINT"
fi

echo ""
echo "Please enter your EYQ Incubator API key:"
read -p "> " AZURE_OPENAI_API_KEY

echo ""
echo "Please enter the deployment name (default: gpt-4o):"
read -p "> " AZURE_OPENAI_DEPLOYMENT_NAME
AZURE_OPENAI_DEPLOYMENT_NAME=${AZURE_OPENAI_DEPLOYMENT_NAME:-gpt-4o}

echo ""
echo "Please enter the API version (default: 2025-04-01-preview):"
read -p "> " AZURE_OPENAI_API_VERSION
AZURE_OPENAI_API_VERSION=${AZURE_OPENAI_API_VERSION:-2025-04-01-preview}

# Update .env file
echo "# Azure OpenAI Configuration" > .env
echo "AZURE_OPENAI_ENDPOINT=$AZURE_OPENAI_ENDPOINT" >> .env
echo "AZURE_OPENAI_API_KEY=$AZURE_OPENAI_API_KEY" >> .env
echo "AZURE_OPENAI_API_VERSION=$AZURE_OPENAI_API_VERSION" >> .env
echo "AZURE_OPENAI_DEPLOYMENT_NAME=$AZURE_OPENAI_DEPLOYMENT_NAME" >> .env
echo "" >> .env
echo "# Application Settings" >> .env
echo "DEBUG=true" >> .env
echo "CORS_ORIGINS=[\"http://localhost:5173\"]" >> .env
echo "UPLOAD_DIR=./uploads" >> .env
echo "MAX_FILE_SIZE=10485760" >> .env

echo ""
echo "EYQ Incubator credentials have been saved to .env file."
echo ""
echo "To run the demo, use:"
echo "./run-demo.sh"
echo ""
echo "==============================================="
