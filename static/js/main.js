// API Escape Room Workshop - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the workshop
    initializeWorkshop();
});

function initializeWorkshop() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.href && !this.href.includes('#')) {
                showLoading(this);
            }
        });
    });

    // Initialize escape room if on escape room page
    if (window.location.pathname === '/escape-room') {
        initializeEscapeRoom();
    }
}

function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.classList.add('loading');

    // Remove loading state after 2 seconds (in case page doesn't load)
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('loading');
    }, 2000);
}

function initializeEscapeRoom() {
    const startForm = document.getElementById('start-form');
    if (startForm) {
        startForm.addEventListener('submit', handleEscapeRoomStart);
    }

    // Check for existing game state
    const playerId = localStorage.getItem('escapeRoomPlayerId');
    if (playerId) {
        loadExistingGame(playerId);
    }
}

function handleEscapeRoomStart(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const playerName = formData.get('playerName');
    const team = formData.get('team');

    if (!playerName || !team) {
        alert('Please fill in all fields');
        return;
    }

    startEscapeRoom(playerName, team);
}

async function startEscapeRoom(playerName, team) {
    try {
        const response = await fetch(`/api/module6/start?player_name=${encodeURIComponent(playerName)}&team=${encodeURIComponent(team)}`);
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('escapeRoomPlayerId', data.player_id);
            localStorage.setItem('escapeRoomPlayerName', playerName);
            localStorage.setItem('escapeRoomTeam', team);

            showEscapeRoomGame(data);
        } else {
            alert('Error starting escape room: ' + data.detail);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to start escape room. Please try again.');
    }
}

function showEscapeRoomGame(gameData) {
    // Hide start form
    const startForm = document.getElementById('start-form');
    if (startForm) {
        startForm.style.display = 'none';
    }

    // Show game interface
    const gameInterface = document.getElementById('game-interface');
    if (gameInterface) {
        gameInterface.style.display = 'block';

        // Update game info
        const playerInfo = document.getElementById('player-info');
        if (playerInfo) {
            playerInfo.innerHTML = `
                <h3>Player: ${localStorage.getItem('escapeRoomPlayerName')}</h3>
                <p>Team: ${localStorage.getItem('escapeRoomTeam')}</p>
                <p>Score: <span id="current-score">0</span></p>
            `;
        }

        // Load first puzzle
        loadPuzzle(1);
    }
}

async function loadPuzzle(puzzleId) {
    const playerId = localStorage.getItem('escapeRoomPlayerId');
    if (!playerId) return;

    try {
        const response = await fetch(`/api/module6/puzzle/${puzzleId}?player_id=${playerId}`);
        const puzzle = await response.json();

        if (response.ok) {
            displayPuzzle(puzzle);
        } else {
            console.error('Error loading puzzle:', puzzle.detail);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPuzzle(puzzle) {
    const puzzleContainer = document.getElementById('puzzle-container');
    if (!puzzleContainer) return;

    // Add progress bar
    const progressHtml = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${(puzzle.id / 8) * 100}%"></div>
        </div>
    `;

    puzzleContainer.innerHTML = `
        ${progressHtml}
        <div class="puzzle-card active">
            <div class="puzzle-status active">Puzzle ${puzzle.id}: ${puzzle.title}</div>
            <h3>${puzzle.title}</h3>
            <p>${puzzle.description}</p>

            <div class="endpoint-example">
                <h4>Endpoint:</h4>
                <div class="interactive-code">
                    <button class="code-copy-btn" onclick="copyToClipboard('${puzzle.endpoint}')">Copy</button>
                    <span class="method">GET</span> <span class="url">${puzzle.endpoint}</span>
                </div>
            </div>

            <div class="puzzle-hint">
                <strong>💡 Hint:</strong> ${puzzle.hint}
            </div>

            <div class="puzzle-input-section">
                <h4>Your Solution:</h4>
                <input type="text" class="puzzle-input" id="solution-${puzzle.id}" placeholder="Enter your answer here...">
                <button onclick="submitSolution(${puzzle.id}, '${puzzle.endpoint}')" class="btn">Submit Solution</button>
            </div>

            <div class="puzzle-actions">
                <button onclick="testEndpoint('${puzzle.endpoint}')" class="btn">Test Endpoint</button>
                <button onclick="showSolution('${puzzle.endpoint}')" class="btn btn-secondary">Show Solution</button>
                <button onclick="requestHint(${puzzle.id})" class="btn btn-secondary">Need More Help?</button>
            </div>

            <div id="puzzle-feedback-${puzzle.id}" class="puzzle-feedback"></div>
        </div>
    `;

    // Add typing animation to description
    animateText(puzzleContainer.querySelector('p'), puzzle.description);
}

async function testEndpoint(endpoint) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        showResponse(data, response.status);
    } catch (error) {
        console.error('Error:', error);
        showResponse({ error: 'Failed to fetch endpoint' }, 500);
    }
}

function showResponse(data, status) {
    const responseContainer = document.getElementById('response-container');
    if (!responseContainer) return;

    // Format the response data for better display
    let formattedData = data;

    // If there are special formatted fields, display them nicely
    if (data.file_structure || data.git_workflow || data.opensource_advantages || data.bruno_benefits) {
        let displayContent = '';

        if (data.file_structure) {
            displayContent += `<div class="formatted-section">
                <h5>📁 File Structure:</h5>
                <div class="code-block">
                    <pre>${data.file_structure.replace(/\\n/g, '\n')}</pre>
                </div>
            </div>`;
        }

        if (data.git_workflow) {
            displayContent += `<div class="formatted-section">
                <h5>📚 Git Workflow:</h5>
                <div class="code-block">
                    <pre>${data.git_workflow.replace(/\\n/g, '\n')}</pre>
                </div>
            </div>`;
        }

        if (data.opensource_advantages) {
            displayContent += `<div class="formatted-section">
                <h5>🌟 Open Source Advantages:</h5>
                <div class="code-block">
                    <pre>${data.opensource_advantages.replace(/\\n/g, '\n')}</pre>
                </div>
            </div>`;
        }

        if (data.bruno_benefits) {
            displayContent += `<div class="formatted-section">
                <h5>🚀 Bruno Benefits:</h5>
                <div class="code-block">
                    <pre>${data.bruno_benefits.replace(/\\n/g, '\n')}</pre>
                </div>
            </div>`;
        }

        // Add the rest of the data
        displayContent += `<div class="formatted-section">
            <h5>📋 Full Response:</h5>
            <div class="code-block">
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>`;

        responseContainer.innerHTML = `
            <h4>Response (Status: ${status})</h4>
            ${displayContent}
        `;
    } else {
        responseContainer.innerHTML = `
            <h4>Response (Status: ${status})</h4>
            <div class="code-block">
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    }

    responseContainer.style.display = 'block';
}

function showSolution(endpoint) {
    const solutions = {
        '/api/module6/secret-header': 'Check the response headers for X-Secret-Message',
        '/api/module6/auth-challenge': 'Use Bearer token authentication',
        '/api/module6/data-puzzle': 'Decode the base64 message "QlJVTk8="',
        '/api/module6/method-challenge': 'Use POST method with {"method": "POST"}',
        '/api/module6/git-puzzle': 'Use "git commit -m" to commit changes',
        '/api/module6/filesystem-puzzle': 'Files enable version control and collaboration',
        '/api/module6/opensource-puzzle': 'Privacy, customization, community, and transparency',
        '/api/module6/bruno-puzzle': 'Reliability, data ownership, and offline access',
        '/api/module6/final-challenge': 'Complete all previous puzzles first'
    };

    const solution = solutions[endpoint];
    if (solution) {
        showNotification('💡 Solution: ' + solution);
    }
}

async function submitSolution(puzzleId, endpoint) {
    const input = document.getElementById(`solution-${puzzleId}`);
    const feedback = document.getElementById(`puzzle-feedback-${puzzleId}`);

    if (!input || !input.value.trim()) {
        showFeedback(feedback, 'Please enter a solution first!', 'error');
        return;
    }

    const solution = input.value.trim();

    // Check solution based on puzzle type
    let isCorrect = false;
    let message = '';

    switch(puzzleId) {
        case 1:
            isCorrect = solution.toLowerCase().includes('header') || solution.toLowerCase().includes('x-secret');
            message = isCorrect ? 'Great! You found the secret in the headers!' : 'Not quite. Look at the response headers.';
            break;
        case 2:
            isCorrect = solution.toLowerCase().includes('token') || solution.toLowerCase().includes('bearer');
            message = isCorrect ? 'Excellent! Authentication is key!' : 'Think about how to authenticate with the API.';
            break;
        case 3:
            isCorrect = solution.toLowerCase().includes('bruno') || solution.toLowerCase().includes('decode');
            message = isCorrect ? 'Perfect! You decoded the message!' : 'Try decoding the base64 message.';
            break;
        case 4:
            isCorrect = solution.toLowerCase().includes('post') || solution.toLowerCase().includes('method');
            message = isCorrect ? 'Correct! POST is the right method!' : 'Consider which HTTP method to use.';
            break;
        case 5:
            isCorrect = solution.toLowerCase().includes('complete') || solution.toLowerCase().includes('finish');
            message = isCorrect ? '🎉 Congratulations! You escaped!' : 'You\'re almost there!';
            break;
    }

    if (isCorrect) {
        showFeedback(feedback, message, 'success');
        input.style.borderColor = '#28a745';
        input.style.backgroundColor = '#d4edda';

        // Move to next puzzle after a delay
        setTimeout(() => {
            if (puzzleId < 5) {
                loadPuzzle(puzzleId + 1);
            } else {
                completeEscapeRoom();
            }
        }, 2000);
    } else {
        showFeedback(feedback, message, 'error');
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#f8d7da';
    }
}

function showFeedback(element, message, type) {
    element.innerHTML = `
        <div class="${type === 'success' ? 'success-message' : 'error-message'}">
            ${message}
        </div>
    `;
}

function requestHint(puzzleId) {
    const hints = {
        1: '🔍 Check the response headers in Bruno. Look for custom headers!',
        2: '🔐 You need to authenticate. Try using a Bearer token in the Authorization header.',
        3: '📝 The message looks encoded. Try decoding base64!',
        4: '🌐 Not all HTTP methods are the same. Which one creates or sends data?',
        5: '📚 Think about Git commands. What do you use to save changes?',
        6: '📁 Files can be tracked by version control. What makes them special?',
        7: '🌟 Open source means free, transparent, and community-driven. What are the benefits?',
        8: '🚀 Bruno works offline. What advantages does this provide?'
    };

    const hint = hints[puzzleId];
    if (hint) {
        showNotification(hint);
    }
}

function animateText(element, text) {
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(timer);
        }
    }, 50);
}

function completeEscapeRoom() {
    const playerName = localStorage.getItem('escapeRoomPlayerName');
    const team = localStorage.getItem('escapeRoomTeam');

    showNotification(`🎉 Congratulations ${playerName} from ${team}! You've successfully escaped the API room!`);

    // Show completion screen
    const puzzleContainer = document.getElementById('puzzle-container');
    if (puzzleContainer) {
        puzzleContainer.innerHTML = `
            <div class="puzzle-card completed">
                <div class="puzzle-status completed">🎉 ESCAPE COMPLETE!</div>
                <h2>Congratulations!</h2>
                <p>You've successfully completed all 8 puzzles and escaped the API room!</p>
                <div class="completion-stats">
                    <h3>Your Achievements:</h3>
                    <ul>
                        <li>✅ REST API Expert</li>
                        <li>✅ Bruno Power User</li>
                        <li>✅ Authentication Master</li>
                        <li>✅ Data Decoding Specialist</li>
                        <li>✅ HTTP Method Navigator</li>
                        <li>✅ Git Collaboration Master</li>
                        <li>✅ File System Explorer</li>
                        <li>✅ Open Source Advocate</li>
                    </ul>
                </div>
                <div class="completion-actions">
                    <button onclick="location.reload()" class="btn btn-primary">Play Again</button>
                    <button onclick="window.open('/docs', '_blank')" class="btn">Explore API Docs</button>
                </div>
            </div>
        `;
    }
}

function loadExistingGame(playerId) {
    // Load existing game state
    const playerName = localStorage.getItem('escapeRoomPlayerName');
    const team = localStorage.getItem('escapeRoomTeam');

    if (playerName && team) {
        showEscapeRoomGame({
            player_id: playerId,
            message: 'Welcome back!'
        });
    }
}

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Game timer functionality
let gameStartTime = null;
let gameTimer = null;

function startGameTimer() {
    gameStartTime = Date.now();
    gameTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!gameStartTime) return;

    const elapsed = Date.now() - gameStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function stopGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

// Enhanced game functions
function showBrunoHelp() {
    const helpContent = `
        <div class="puzzle-hint">
            <h4>📖 Bruno Help</h4>
            <ul>
                <li><strong>Import Collections:</strong> File → Import Collection → Select folder</li>
                <li><strong>Environment Variables:</strong> Use {{baseUrl}} for URLs</li>
                <li><strong>Headers:</strong> Add Authorization: Bearer your-token</li>
                <li><strong>Request Body:</strong> Use JSON format for POST requests</li>
                <li><strong>Response:</strong> Check headers, body, and status codes</li>
            </ul>
        </div>
    `;
    showNotification(helpContent);
}

function showAPIDocs() {
    window.open('/docs', '_blank');
}

function resetGame() {
    if (confirm('Are you sure you want to reset the game? This will clear your progress.')) {
        localStorage.removeItem('escapeRoomPlayerId');
        localStorage.removeItem('escapeRoomPlayerName');
        localStorage.removeItem('escapeRoomTeam');
        stopGameTimer();
        location.reload();
    }
}

function updateGameStats() {
    const scoreElement = document.getElementById('current-score');
    const puzzleCountElement = document.getElementById('puzzle-count');

    if (scoreElement) {
        const currentScore = parseInt(scoreElement.textContent) || 0;
        scoreElement.textContent = currentScore + 10;
    }

    if (puzzleCountElement) {
        const currentCount = parseInt(puzzleCountElement.textContent.split('/')[0]) || 0;
        puzzleCountElement.textContent = `${currentCount + 1}/8`;
    }
}

function updatePuzzleNavigation(currentPuzzle) {
    const navButtons = document.querySelectorAll('.puzzle-nav-btn');
    navButtons.forEach((btn, index) => {
        btn.classList.remove('active', 'completed');
        if (index + 1 === currentPuzzle) {
            btn.classList.add('active');
        } else if (index + 1 < currentPuzzle) {
            btn.classList.add('completed');
        }
    });
}

// Enhanced puzzle loading with stats update
async function loadPuzzle(puzzleId) {
    const playerId = localStorage.getItem('escapeRoomPlayerId');
    if (!playerId) return;

    try {
        const response = await fetch(`/api/module6/puzzle/${puzzleId}?player_id=${playerId}`);
        const puzzle = await response.json();

        if (response.ok) {
            puzzle.id = puzzleId; // Add ID for progress calculation
            displayPuzzle(puzzle);
            updatePuzzleNavigation(puzzleId);
        } else {
            console.error('Error loading puzzle:', puzzle.detail);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Enhanced solution submission
async function submitSolution(puzzleId, endpoint) {
    const input = document.getElementById(`solution-${puzzleId}`);
    const feedback = document.getElementById(`puzzle-feedback-${puzzleId}`);

    if (!input || !input.value.trim()) {
        showFeedback(feedback, 'Please enter a solution first!', 'error');
        return;
    }

    const solution = input.value.trim();

    // Check solution based on puzzle type
    let isCorrect = false;
    let message = '';

    switch(puzzleId) {
        case 1:
            isCorrect = solution.toLowerCase().includes('header') || solution.toLowerCase().includes('x-secret');
            message = isCorrect ? 'Great! You found the secret in the headers!' : 'Not quite. Look at the response headers.';
            break;
        case 2:
            isCorrect = solution.toLowerCase().includes('token') || solution.toLowerCase().includes('bearer');
            message = isCorrect ? 'Excellent! Authentication is key!' : 'Think about how to authenticate with the API.';
            break;
        case 3:
            isCorrect = solution.toLowerCase().includes('bruno') || solution.toLowerCase().includes('decode');
            message = isCorrect ? 'Perfect! You decoded the message!' : 'Try decoding the base64 message.';
            break;
        case 4:
            isCorrect = solution.toLowerCase().includes('post') || solution.toLowerCase().includes('method');
            message = isCorrect ? 'Correct! POST is the right method!' : 'Consider which HTTP method to use.';
            break;
        case 5:
            isCorrect = solution.toLowerCase().includes('commit') || solution.toLowerCase().includes('git');
            message = isCorrect ? 'Excellent! You understand Git workflow!' : 'Think about Git commands for saving changes.';
            break;
        case 6:
            isCorrect = solution.toLowerCase().includes('version') || solution.toLowerCase().includes('control') || solution.toLowerCase().includes('collaboration');
            message = isCorrect ? 'Perfect! Files enable team collaboration!' : 'Think about how files differ from databases.';
            break;
        case 7:
            isCorrect = solution.toLowerCase().includes('privacy') || solution.toLowerCase().includes('community') || solution.toLowerCase().includes('customization');
            message = isCorrect ? 'Great! You understand open source benefits!' : 'Think about advantages of open source software.';
            break;
        case 8:
            isCorrect = solution.toLowerCase().includes('reliability') || solution.toLowerCase().includes('offline') || solution.toLowerCase().includes('ownership');
            message = isCorrect ? 'Outstanding! You mastered Bruno concepts!' : 'Think about offline-first benefits.';
            break;
    }

    if (isCorrect) {
        showFeedback(feedback, message, 'success');
        input.style.borderColor = '#28a745';
        input.style.backgroundColor = '#d4edda';
        updateGameStats();

        // Move to next puzzle after a delay
        setTimeout(() => {
            if (puzzleId < 8) {
                loadPuzzle(puzzleId + 1);
            } else {
                completeEscapeRoom();
            }
        }, 2000);
    } else {
        showFeedback(feedback, message, 'error');
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#f8d7da';
    }
}

// Enhanced game start
function showEscapeRoomGame(gameData) {
    // Hide start form
    const startForm = document.getElementById('start-form');
    if (startForm) {
        startForm.style.display = 'none';
    }

    // Show game interface
    const gameInterface = document.getElementById('game-interface');
    if (gameInterface) {
        gameInterface.style.display = 'block';

        // Update game info
        const playerInfo = document.getElementById('player-info');
        if (playerInfo) {
            playerInfo.innerHTML = `
                <h3>👤 Player: ${localStorage.getItem('escapeRoomPlayerName')}</h3>
                <p>🏆 Team: ${localStorage.getItem('escapeRoomTeam')}</p>
                <p>🎮 Status: Ready to Escape!</p>
            `;
        }

        // Start timer
        startGameTimer();

        // Load first puzzle
        loadPuzzle(1);
    }
}
