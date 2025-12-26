from dotenv import load_dotenv
import os

load_dotenv()

print("DATABASE_URL:", os.getenv("DATABASE_URL"))
print("CORS_ORIGINS:", os.getenv("CORS_ORIGINS"))

# Now test Pydantic settings
try:
    from app.config import settings
    print("✅ Settings loaded successfully!")
    print("Database URL:", settings.database_url)
    print("CORS Origins:", settings.cors_origins)
except Exception as e:
    print(f"❌ Settings loading failed: {e}")