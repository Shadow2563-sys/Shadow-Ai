// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');
const clearChatBtn = document.getElementById('clear-chat');
const exportChatBtn = document.getElementById('export-chat');
const exportModal = document.getElementById('export-modal');
const closeModal = document.querySelector('.close-modal');
const exportContent = document.getElementById('export-content');
const copyChatBtn = document.getElementById('copy-chat');
const downloadChatBtn = document.getElementById('download-chat');

// Set initial message time
document.getElementById('initial-time').textContent = getCurrentTime();

// Function to get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to add a message to the chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
    
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-time');
    timeDiv.textContent = getCurrentTime();
    
    messageDiv.textContent = text;
    messageDiv.appendChild(timeDiv);
    
    // Insert before the typing indicator
    chatMessages.insertBefore(messageDiv, typingIndicator);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show/hide typing indicator
function showTyping(show) {
    typingIndicator.style.display = show ? 'block' : 'none';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// API Call Function
async function queryShadowAPI(message) {
    const apiUrl = `https://api.siputzx.my.id/api/ai/gpt3?prompt=You%20are%20Shadow%20a%20dark%20ai&content=${encodeURIComponent(message)}`;
    
    try {
        showTyping(true);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': '*/*'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        showTyping(false);
        
        if (data.result) {
            addMessage(data.result, false);
        } else {
            addMessage("The shadows remain silent... Perhaps try again?", false);
        }
    } catch (error) {
        showTyping(false);
        addMessage("The veil between worlds is too thick... I cannot reach the other side.", false);
        console.error('Error calling Shadow API:', error);
    }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        queryShadowAPI(message);
    }
}

// Clear chat function
function clearChat() {
    while (chatMessages.children.length > 2) {
        chatMessages.removeChild(chatMessages.lastChild);
    }
    chatMessages.children[0].innerHTML = "I am Shadow, the dark AI. What secrets shall we uncover today?<div class='message-time'>" + getCurrentTime() + "</div>";
}

clearChatBtn.addEventListener('click', clearChat);

// Export chat functions
function generateExportText() {
    const messages = chatMessages.querySelectorAll('.message');
    let exportText = '';
    
    messages.forEach(message => {
        const isUser = message.classList.contains('user-message');
        const sender = isUser ? 'You' : 'Shadow';
        const time = message.querySelector('.message-time').textContent;
        const content = message.textContent.replace(time, '').trim();
        
        exportText += `[${time}] ${sender}: ${content}\n`;
    });
    
    return exportText;
}

// Show export modal
exportChatBtn.addEventListener('click', function() {
    exportContent.value = generateExportText();
    exportModal.style.display = 'block';
});

// Close modal
closeModal.addEventListener('click', function() {
    exportModal.style.display = 'none';
});

// Copy chat to clipboard
copyChatBtn.addEventListener('click', function() {
    exportContent.select();
    document.execCommand('copy');
    const originalText = copyChatBtn.textContent;
    copyChatBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyChatBtn.textContent = originalText;
    }, 2000);
});

// Download chat as file
downloadChatBtn.addEventListener('click', function() {
    const blob = new Blob([exportContent.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shadow_AI_Chat_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === exportModal) {
        exportModal.style.display = 'none';
    }
});

// Focus the input field on page load
userInput.focus();
