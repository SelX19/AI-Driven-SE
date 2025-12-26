import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="notes_app",
        user="selmadjozic",
        password="12345"
    )
    print("✅ Database connection successful!")
    conn.close()
except Exception as e:
    print(f"❌ Database connection failed: {e}")