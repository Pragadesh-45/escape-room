# API Escape Room Workshop - Complete Guide

## Overview

This workshop combines API development education with an interactive, game-like learning experience. Students learn REST API basics and Bruno API client usage through solving puzzles in an "escape room" format.

## Prerequisites

- Basic understanding of web development concepts
- Python 3.8+ installed
- Bruno API client downloaded from [usebruno.com](https://www.usebruno.com/)
- Git installed (for Module 5)

## Setup Instructions

### 1. Clone and Setup
```bash
git clone <workshop-repository>
cd escape-room
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python main.py
```
The FastAPI server will start on `http://localhost:8000`

### 3. Import Bruno Collections
1. Open Bruno
2. Import each collection from the `collections/` folder:
   - Module 1: REST API Basics
   - Module 2: Bruno API Client
   - Module 3: API Client Components
   - Module 4: File System Based Approach
   - Module 5: Git Integrated API Client
   - Module 6: Escape Room Challenge

## Workshop Structure

### Module 1: REST API Basics
**Duration:** 30 minutes
**Learning Objectives:**
- Understand HTTP methods (GET, POST, PUT, DELETE)
- Learn request/response patterns
- Understand status codes and error handling
- Practice with path parameters and request bodies

**Bruno Collection:** `collections/module1-rest-basics/`
**Key Requests:**
- Hello World (GET)
- Get User by ID (GET with path parameter)
- Create User (POST with JSON body)
- Update User (PUT)
- Delete User (DELETE)

### Module 2: Bruno API Client
**Duration:** 25 minutes
**Learning Objectives:**
- Navigate Bruno interface
- Understand environment variables
- Learn request/response visualization
- Practice with headers and body types

**Bruno Collection:** `collections/module2-bruno-client/`
**Key Requests:**
- API Status Check
- Headers Demonstration
- Echo Request (POST with body)

### Module 3: API Client Components
**Duration:** 35 minutes
**Learning Objectives:**
- Understand authentication flows
- Learn token-based authentication
- Practice with protected endpoints
- Understand authorization headers

**Bruno Collection:** `collections/module3-api-components/`
**Key Requests:**
- Authentication (Login)
- Protected Endpoint (Bearer token)

### Module 4: File System Based Approach
**Duration:** 20 minutes
**Learning Objectives:**
- Understand Bruno's file-based storage
- Learn collection organization
- Understand environment management
- Practice with file structure

**Bruno Collection:** `collections/module4-filesystem/`
**Key Requests:**
- Collection Structure Demo

### Module 5: Git Integrated API Client
**Duration:** 30 minutes
**Learning Objectives:**
- Understand Git integration with Bruno
- Learn team collaboration workflows
- Practice version control for API collections
- Understand merge conflict resolution

**Bruno Collection:** `collections/module5-git-integration/`
**Key Requests:**
- Git Status Demo
- Git Commit Demo

### Module 6: Escape Room Challenge
**Duration:** 45 minutes
**Learning Objectives:**
- Apply all learned concepts
- Solve real-world API problems
- Work collaboratively in teams
- Practice problem-solving skills

**Bruno Collection:** `collections/module6-escape-room/`
**Puzzles:**
1. The Hidden Header - Find secret in response headers
2. The Authentication Challenge - Use tokens correctly
3. The Data Puzzle - Decode encrypted messages
4. The Method Master - Choose correct HTTP methods
5. The Final Challenge - Combine all knowledge

## Teaching Tips

### For Instructors

1. **Start with the Web Interface**
   - Show students the main workshop page
   - Demonstrate the API documentation at `/docs`
   - Explain the escape room concept

2. **Bruno Setup**
   - Walk through Bruno installation
   - Show how to import collections
   - Demonstrate environment variables

3. **Progressive Learning**
   - Complete modules in order
   - Encourage experimentation
   - Allow students to modify requests

4. **Escape Room Facilitation**
   - Form teams of 2-4 students
   - Encourage collaboration
   - Provide hints when needed
   - Track completion times

### For Students

1. **Follow the Sequence**
   - Complete modules 1-5 before the escape room
   - Read the documentation in each Bruno request
   - Experiment with different parameters

2. **Use Resources**
   - Check the API documentation at `/docs`
   - Use Bruno's request history
   - Collaborate with teammates

3. **Escape Room Strategy**
   - Read each puzzle carefully
   - Use Bruno to test your solutions
   - Work together as a team
   - Don't hesitate to ask for hints

## Assessment

### Module Completion
- Each module has specific learning objectives
- Students should complete all requests in each collection
- Encourage experimentation and modification

### Escape Room Evaluation
- **Speed:** How quickly teams complete all puzzles
- **Accuracy:** Correct solutions to each puzzle
- **Collaboration:** How well teams work together
- **Problem Solving:** Approach to challenging puzzles

### Skills Demonstrated
- HTTP method selection
- Request/response understanding
- Authentication handling
- Error troubleshooting
- API documentation usage

## Troubleshooting

### Common Issues

1. **Server Not Starting**
   - Check Python version (3.8+)
   - Install requirements: `pip install -r requirements.txt`
   - Check port 8000 availability

2. **Bruno Import Issues**
   - Ensure collection folders are complete
   - Check `bruno.json` files
   - Verify environment variables

3. **API Request Failures**
   - Verify server is running on localhost:8000
   - Check environment variables in Bruno
   - Review request syntax

4. **Escape Room Puzzles**
   - Read puzzle descriptions carefully
   - Check response headers and body
   - Use Bruno's response analysis features

## Extensions

### Advanced Topics
- API versioning strategies
- Rate limiting and throttling
- Webhook implementation
- API testing automation

### Additional Challenges
- Create custom API endpoints
- Build your own escape room puzzles
- Implement authentication flows
- Design API collection structures

## Resources

- [Bruno Documentation](https://www.usebruno.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)

## Contributing

This workshop is designed to be educational and collaborative. Feel free to:
- Add new modules
- Create additional puzzles
- Improve documentation
- Share your experiences

## License

MIT License - Feel free to use and modify for educational purposes.
