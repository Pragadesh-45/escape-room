"""
API Escape Room Workshop - Main FastAPI Application
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
import os
from datetime import datetime, timedelta
import secrets

app = FastAPI(
    title="API Escape Room Workshop",
    description="Interactive workshop for learning APIs with Bruno",
    version="1.0.0"
)

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Game state storage (in production, use a database)
game_state = {
    "players": {},
    "puzzles": {},
    "leaderboard": []
}

# Pydantic models
class Player(BaseModel):
    name: str
    team: str
    current_puzzle: int = 1
    score: int = 0
    start_time: Optional[datetime] = None

class PuzzleResponse(BaseModel):
    success: bool
    message: str
    next_clue: Optional[str] = None
    score: int = 0

class APIRequest(BaseModel):
    method: str
    endpoint: str
    headers: Optional[Dict[str, str]] = {}
    body: Optional[Dict] = {}

# Module 1: REST API Basics
@app.get("/api/module1/hello")
async def hello_world():
    """Simple GET endpoint to demonstrate basic API interaction"""
    return {"message": "Hello, API Explorer!", "timestamp": datetime.now().isoformat()}

@app.get("/api/module1/user/{user_id}")
async def get_user(user_id: int):
    """GET endpoint with path parameters"""
    users = {
        1: {"id": 1, "name": "Alice", "role": "student"},
        2: {"id": 2, "name": "Bob", "role": "instructor"},
        3: {"id": 3, "name": "Charlie", "role": "student"}
    }

    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")

    return users[user_id]

@app.post("/api/module1/users")
async def create_user(user_data: dict):
    """POST endpoint for creating resources"""
    if not user_data.get("name"):
        raise HTTPException(status_code=400, detail="Name is required")

    new_user = {
        "id": len(user_data) + 3,  # Simple ID generation
        "name": user_data["name"],
        "role": user_data.get("role", "student"),
        "created_at": datetime.now().isoformat()
    }

    return {"message": "User created successfully", "user": new_user}

@app.put("/api/module1/users/{user_id}")
async def update_user(user_id: int, user_data: dict):
    """PUT endpoint for updating resources"""
    if user_id < 1 or user_id > 3:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "message": f"User {user_id} updated successfully",
        "updated_fields": list(user_data.keys()),
        "timestamp": datetime.now().isoformat()
    }

@app.delete("/api/module1/users/{user_id}")
async def delete_user(user_id: int):
    """DELETE endpoint for removing resources"""
    if user_id < 1 or user_id > 3:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": f"User {user_id} deleted successfully"}

# Module 2: Bruno Client Features
@app.get("/api/module2/status")
async def api_status():
    """Endpoint to test basic connectivity"""
    return {
        "status": "online",
        "version": "1.0.0",
        "features": ["GET", "POST", "PUT", "DELETE", "Headers", "Authentication"]
    }

@app.get("/api/module2/headers")
async def check_headers(request: Request):
    """Endpoint that reads and returns request headers"""
    headers = dict(request.headers)
    return {
        "received_headers": headers,
        "message": "Headers successfully received!"
    }

@app.post("/api/module2/echo")
async def echo_request(request_data: dict, request: Request):
    """Echo endpoint that returns request data and headers"""
    return {
        "method": request.method,
        "body": request_data,
        "headers": dict(request.headers),
        "timestamp": datetime.now().isoformat()
    }

# Module 3: API Components
@app.get("/api/module3/auth/basic")
async def basic_auth_example():
    """Example of basic authentication endpoint"""
    return {
        "message": "This endpoint demonstrates basic auth",
        "note": "Use Authorization header with 'Basic' prefix"
    }

@app.post("/api/module3/auth/login")
async def login(credentials: dict):
    """Login endpoint for authentication"""
    username = credentials.get("username")
    password = credentials.get("password")

    if username == "student" and password == "workshop2024":
        token = secrets.token_urlsafe(32)
        return {
            "success": True,
            "token": token,
            "expires_in": 3600,
            "message": "Login successful!"
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/module3/protected")
async def protected_endpoint(authorization: str = None):
    """Protected endpoint requiring authentication"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Bearer token required")

    return {
        "message": "Access granted to protected resource",
        "data": "This is sensitive information",
        "timestamp": datetime.now().isoformat()
    }

# Module 4: File System Approach
@app.get("/api/module4/collections")
async def list_collections():
    """Endpoint that simulates Bruno's collection structure"""
    collections = [
        {
            "name": "Workshop Collection",
            "path": "/collections/workshop",
            "requests": 6,
            "folders": 2
        },
        {
            "name": "Practice Collection",
            "path": "/collections/practice",
            "requests": 3,
            "folders": 1
        }
    ]
    return {"collections": collections}

@app.get("/api/module4/collection/{collection_name}")
async def get_collection_details(collection_name: str):
    """Get details about a specific collection"""
    if collection_name not in ["workshop", "practice"]:
        raise HTTPException(status_code=404, detail="Collection not found")

    return {
        "name": collection_name,
        "structure": {
            "requests": f"/collections/{collection_name}/requests/",
            "environments": f"/collections/{collection_name}/environments/",
            "metadata": f"/collections/{collection_name}/bruno.json"
        },
        "message": "This simulates Bruno's file-based approach"
    }

# Module 5: Git Integration
@app.get("/api/module5/git/status")
async def git_status():
    """Simulate Git status for API collections"""
    return {
        "repository": "api-escape-room-workshop",
        "branch": "main",
        "status": "clean",
        "last_commit": "Added new API endpoints for workshop",
        "collections_tracked": ["workshop", "practice", "escape-room"]
    }

@app.post("/api/module5/git/commit")
async def git_commit(commit_data: dict):
    """Simulate Git commit for API collection changes"""
    message = commit_data.get("message", "Updated API collection")
    files = commit_data.get("files", [])

    return {
        "success": True,
        "commit_hash": secrets.token_hex(8),
        "message": message,
        "files_changed": len(files),
        "timestamp": datetime.now().isoformat()
    }

# Module 6: Escape Room Challenge
@app.get("/api/module6/start")
async def start_escape_room(player_name: str, team: str):
    """Start the escape room challenge"""
    player_id = secrets.token_hex(4)

    game_state["players"][player_id] = {
        "name": player_name,
        "team": team,
        "current_puzzle": 1,
        "score": 0,
        "start_time": datetime.now(),
        "puzzles_solved": []
    }

    return {
        "player_id": player_id,
        "message": "Welcome to the API Escape Room!",
        "first_clue": "Find the hidden message in the response headers",
        "puzzle_count": 8
    }

@app.get("/api/module6/puzzle/{puzzle_id}")
async def get_puzzle(puzzle_id: int, player_id: str):
    """Get puzzle details"""
    if player_id not in game_state["players"]:
        raise HTTPException(status_code=404, detail="Player not found")

    puzzles = {
        1: {
            "title": "The Hidden Header",
            "description": "Find the secret message in the response headers",
            "endpoint": "/api/module6/secret-header",
            "hint": "Check the X-Secret-Message header"
        },
        2: {
            "title": "The Authentication Challenge",
            "description": "Authenticate to access the next clue",
            "endpoint": "/api/module6/auth-challenge",
            "hint": "Use the token from puzzle 1"
        },
        3: {
            "title": "The Data Puzzle",
            "description": "Decode the encrypted message",
            "endpoint": "/api/module6/data-puzzle",
            "hint": "The answer is in the response body"
        },
        4: {
            "title": "The Method Master",
            "description": "Use the correct HTTP method to proceed",
            "endpoint": "/api/module6/method-challenge",
            "hint": "Not all methods are created equal"
        },
        5: {
            "title": "The Git Repository",
            "description": "Navigate the file-based collection structure",
            "endpoint": "/api/module6/git-puzzle",
            "hint": "Bruno collections are stored as files"
        },
        6: {
            "title": "The File System Explorer",
            "description": "Understand Bruno's file-based approach",
            "endpoint": "/api/module6/filesystem-puzzle",
            "hint": "Collections are organized in folders"
        },
        7: {
            "title": "The Open Source Advocate",
            "description": "Learn about Bruno's open source nature",
            "endpoint": "/api/module6/opensource-puzzle",
            "hint": "Bruno is free and open source"
        },
        8: {
            "title": "The Bruno Master",
            "description": "Master Bruno's advanced features",
            "endpoint": "/api/module6/bruno-puzzle",
            "hint": "Bruno has powerful collaboration features"
        }
    }

    if puzzle_id not in puzzles:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    return puzzles[puzzle_id]

@app.get("/api/module6/secret-header")
async def secret_header():
    """Puzzle 1: Find secret in headers"""
    return {
        "message": "Look carefully at the response headers",
        "data": "This is just regular data"
    }

@app.get("/api/module6/auth-challenge")
async def auth_challenge(authorization: str = None):
    """Puzzle 2: Authentication challenge"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    return {
        "message": "Authentication successful!",
        "next_clue": "The answer to puzzle 3 is 'BRUNO'",
        "progress": "2/5 puzzles completed"
    }

@app.get("/api/module6/data-puzzle")
async def data_puzzle():
    """Puzzle 3: Data decoding challenge"""
    return {
        "encrypted_message": "QlJVTk8=",  # Base64 for "BRUNO"
        "hint": "This looks like it needs decoding",
        "message": "Decode this message to proceed"
    }

@app.post("/api/module6/method-challenge")
async def method_challenge(request_data: dict):
    """Puzzle 4: HTTP method challenge"""
    if request_data.get("method") == "POST":
        return {
            "message": "Correct method!",
            "next_clue": "You're ready for the final challenge",
            "progress": "4/5 puzzles completed"
        }
    else:
        raise HTTPException(status_code=405, detail="Wrong method")

@app.get("/api/module6/git-puzzle")
async def git_puzzle():
    """Puzzle 5: Git integration challenge"""
    return {
        "message": "Welcome to the Git puzzle!",
        "git_workflow": "Git Workflow with Bruno Collections:\n1. git init                    # Initialize repository\n2. git add .                   # Stage all files\n3. git commit -m \"message\"    # Commit changes\n4. git push origin main        # Push to remote\n5. git pull origin main        # Pull team changes",
        "git_info": {
            "repository": "api-workshop-collections",
            "branch": "main",
            "last_commit": "Added new API endpoints",
            "files_tracked": ["bruno.json", "requests/", "environments/"],
            "collaborators": ["team-lead", "api-developer", "qa-engineer"]
        },
        "challenge": "What command would you use to commit changes to your Bruno collection?",
        "hint": "Think about Git's basic workflow commands"
    }

@app.get("/api/module6/filesystem-puzzle")
async def filesystem_puzzle():
    """Puzzle 6: File system structure challenge"""
    return {
        "message": "Explore Bruno's file-based approach!",
        "file_structure": "workshop-collection/\n├── bruno.json          # Collection metadata\n├── environments/        # Environment variables\n│   ├── local.bru\n│   └── production.bru\n└── requests/            # API requests\n    ├── 01-hello-world.bru\n    ├── 02-get-users.bru\n    └── auth/\n        └── login.bru",
        "collection_structure": {
            "workshop-collection/": {
                "bruno.json": "Collection metadata",
                "environments/": {
                    "local.bru": "Local environment variables",
                    "production.bru": "Production environment variables"
                },
                "requests/": {
                    "01-hello-world.bru": "Hello world request",
                    "02-get-users.bru": "Get users request",
                    "auth/": {
                        "login.bru": "Authentication request"
                    }
                }
            }
        },
        "challenge": "How does Bruno's file-based approach help with version control?",
        "hint": "Think about what makes files different from databases"
    }

@app.get("/api/module6/opensource-puzzle")
async def opensource_puzzle():
    """Puzzle 7: Open source advocacy challenge"""
    return {
        "message": "Learn about Bruno's open source nature!",
        "opensource_advantages": "Open Source Advantages:\n🔒 Privacy - No data sent to external servers\n🛠️ Customization - Modify and extend functionality\n👥 Community - Large community of contributors\n💰 Cost - Completely free to use\n🔍 Transparency - Source code is auditable\n🚀 Innovation - Rapid development and improvements\n🔓 Freedom - No vendor lock-in",
        "opensource_facts": {
            "license": "MIT License",
            "github_stars": "37k+",
            "contributors": "345+",
            "features": [
                "Free and open source",
                "No cloud dependency",
                "Privacy-focused",
                "Community-driven"
            ],
            "alternatives": ["Postman", "Insomnia", "Thunder Client"]
        },
        "challenge": "What are the main advantages of Bruno being open source?",
        "hint": "Think about privacy, customization, and community"
    }

@app.get("/api/module6/bruno-puzzle")
async def bruno_puzzle():
    """Puzzle 8: Bruno mastery challenge"""
    return {
        "message": "Master Bruno's advanced features!",
        "bruno_benefits": "Bruno's Offline-First Benefits:\n✅ Reliability - Works without internet\n✅ Data Ownership - Your data stays local\n✅ Privacy - No data sent to external servers\n✅ Performance - Faster than cloud-based tools\n✅ Independence - No vendor lock-in\n✅ Team Control - Full control over collections",
        "bruno_features": {
            "core_features": [
                "File-based collections",
                "Environment variables",
                "Request history",
                "Team collaboration via Git"
            ],
            "advanced_features": [
                "Scripts and pre-request hooks",
                "Collection documentation",
                "Import/export capabilities",
                "Offline-first approach"
            ],
            "collaboration": [
                "Git integration",
                "Shared collections",
                "Version control",
                "Merge conflict resolution"
            ]
        },
        "challenge": "How does Bruno's offline-first approach benefit teams?",
        "hint": "Think about reliability and data ownership"
    }

@app.get("/api/module6/final-challenge")
async def final_challenge(player_id: str):
    """Puzzle 8: Final escape room challenge"""
    if player_id not in game_state["players"]:
        raise HTTPException(status_code=404, detail="Player not found")

    player = game_state["players"][player_id]
    player["score"] += 100
    player["current_puzzle"] = 9  # Completed

    return {
        "message": "🎉 Congratulations! You've escaped the API room!",
        "final_score": player["score"],
        "completion_time": (datetime.now() - player["start_time"]).total_seconds(),
        "certificate": f"API Escape Room Master - {player['name']}",
        "achievements": [
            "REST API Expert",
            "Bruno Power User",
            "Git Collaboration Master",
            "Open Source Advocate",
            "File System Navigator"
        ]
    }

# Frontend routes
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Main workshop page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/module/{module_id}", response_class=HTMLResponse)
async def module_page(request: Request, module_id: int):
    """Individual module pages"""
    return templates.TemplateResponse(f"module{module_id}.html", {"request": request})

@app.get("/escape-room", response_class=HTMLResponse)
async def escape_room_page(request: Request):
    """Escape room game page"""
    return templates.TemplateResponse("escape-room.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
