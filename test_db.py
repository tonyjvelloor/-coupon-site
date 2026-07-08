import psycopg2
import sys

db_url = "postgresql://neondb_owner:npg_itzOIV64sDge@ep-cool-sound-aohp772o-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

try:
    conn = psycopg2.connect(db_url, connect_timeout=15)
    print("Connection successful!")
    conn.close()
    sys.exit(0)
except Exception as e:
    print("Connection failed:", str(e))
    sys.exit(1)
