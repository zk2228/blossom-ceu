#!/usr/bin/env python3
import json, os, sqlite3, sys
from datetime import datetime

DB_PATH = "completions.db"

db = sqlite3.connect(DB_PATH)
db.execute("""
    CREATE TABLE IF NOT EXISTS completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        bacb_cert_number TEXT NOT NULL,
        episode TEXT NOT NULL,
        date_watched TEXT NOT NULL,
        completed_at TEXT NOT NULL
    )
""")
db.commit()

method = os.environ.get("REQUEST_METHOD", "GET")
path_info = os.environ.get("PATH_INFO", "")

if method == "POST":
    # Log a new certificate completion
    try:
        body = json.loads(sys.stdin.read())
        name = body.get("name", "").strip()
        email = body.get("email", "").strip()
        bacb = body.get("bacbCertNumber", "").strip()
        episode = body.get("episode", "").strip()
        date_watched = body.get("dateWatched", "").strip()
        completed_at = datetime.utcnow().isoformat() + "Z"

        if not all([name, email, bacb, episode, date_watched]):
            print("Status: 400")
            print("Content-Type: application/json")
            print()
            print(json.dumps({"error": "Missing required fields"}))
            sys.exit(0)

        db.execute(
            "INSERT INTO completions (name, email, bacb_cert_number, episode, date_watched, completed_at) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, bacb, episode, date_watched, completed_at]
        )
        db.commit()

        print("Status: 201")
        print("Content-Type: application/json")
        print()
        print(json.dumps({"status": "logged", "completed_at": completed_at}))
    except Exception as e:
        print("Status: 400")
        print("Content-Type: application/json")
        print()
        print(json.dumps({"error": str(e)}))

elif method == "GET":
    # Return all completions as JSON (for admin viewing)
    rows = db.execute(
        "SELECT id, name, email, bacb_cert_number, episode, date_watched, completed_at FROM completions ORDER BY id DESC"
    ).fetchall()

    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "bacbCertNumber": row[3],
            "episode": row[4],
            "dateWatched": row[5],
            "completedAt": row[6]
        })

    print("Content-Type: application/json")
    print()
    print(json.dumps(results, indent=2))

else:
    print("Status: 405")
    print("Content-Type: application/json")
    print()
    print(json.dumps({"error": "Method not allowed"}))
