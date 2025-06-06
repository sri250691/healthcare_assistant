# Using EYQ Incubator with Healthcare Chatbot Demo

This document provides instructions on how to properly configure and use the Healthcare Chatbot Demo with EYQ Incubator.

## About EYQ Incubator

EYQ Incubator is an internal AI platform that provides access to large language models for EY applications. The Healthcare Chatbot Demo has been updated to work with EYQ Incubator instead of the standard Azure OpenAI service.

## Configuration Steps

1. **Verify your .env file**: The .env file should contain the following EYQ Incubator settings:

   ```bash
   # EYQ Incubator Configuration
   AZURE_OPENAI_ENDPOINT=https://eyq-incubator.europe.fabric.ey.com/eyq/eu/api
   AZURE_OPENAI_API_KEY=YOUR_EYQ_INCUBATOR_API_KEY
   AZURE_OPENAI_API_VERSION=2024-05-01-preview
   AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
   ```

2. **Obtain API Key**: If you don't have an EYQ Incubator API key, please contact the EYQ team.

3. **Run the configuration script**:

   ```bash
   ./configure-azure-openai.sh
   ```

   This script will guide you through setting up your EYQ Incubator credentials.

## Troubleshooting

If you encounter issues with the EYQ Incubator connection:

1. **Check your endpoint URL**: Make sure it includes the full path (`https://eyq-incubator.europe.fabric.ey.com/eyq/eu/api`).

2. **Validate your API key**: Ensure your API key is correct and has not expired.

3. **Network access**: Confirm that your network allows connections to the EYQ Incubator endpoints.

4. **Check logs**: Review the backend logs for specific error messages:

   ```bash
   cd backend
   source venv/bin/activate
   python -m app.main
   ```

5. **API Version**: If you receive version-related errors, try updating the API version in your .env file.

## Important Notes

- The chat text has been updated to display in white color for better readability.
- Messages from the EYQ Incubator API will now be displayed with "via EYQ Incubator" attribution.
- The Healthcare Assistant branding remains the same, only the backend service has changed.

## Additional Resources

For more information about EYQ Incubator or to report issues, please contact the EYQ team.
