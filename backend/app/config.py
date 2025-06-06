try:
    from pydantic_settings import BaseSettings  # For newer pydantic versions
except ImportError:
    from pydantic import BaseSettings  # For older pydantic versions
from typing import List
import os

class Settings(BaseSettings):
    # EYQ Incubator OpenAI (using Azure OpenAI environment variables for compatibility)
    azure_openai_endpoint: str = ""
    azure_openai_api_key: str = ""
    azure_openai_api_version: str = "2025-04-01-preview"
    azure_openai_deployment_name: str = "gpt-4o"
    
    # App settings
    debug: bool = True
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:*"]
    upload_dir: str = "./uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"
        
    def validate_endpoint(self):
        """Validates the endpoint URL format"""
        if self.azure_openai_endpoint and "://" not in self.azure_openai_endpoint:
            self.azure_openai_endpoint = f"https://{self.azure_openai_endpoint}"
            print(f"WARNING: Added https:// to endpoint: {self.azure_openai_endpoint}")
        return self.azure_openai_endpoint

settings = Settings()
