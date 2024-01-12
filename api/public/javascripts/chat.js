// ./public/javascripts/chat.js
import socket from './socket.js';

const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');

// Store opponent's socket ID (you need to set this when the opponent connects)
let opponentSocketId = null;

// Function to display a new message in the chat
function displayMessage(message) {
    const li = document.createElement('li');
    li.textContent = message;
    chatMessages.appendChild(li);
}

// Function to send a message to the opponent
function sendMessageToOpponent() {
    const message = messageInput.value;
    console.log('Message:', message);
    if (message.trim() !== '' && opponentSocketId) {
        socket.emit('sendMessageToOpponent', { message, opponentSocketId });
        displayMessage(`You to Opponent: ${message}`);
        messageInput.value = ''; // Clear the input field
    }
}

// Listen for incoming messages
socket.on('receiveMessageFromOpponent', ({ player, message }) => {
    displayMessage(`${player}: ${message}`);
});

// You need to set the opponent's socket ID when it becomes known
function setOpponentSocketId(socketId) {
    opponentSocketId = socketId;
}

// Add event listener to send button
document.getElementById('sendButton').addEventListener('click', () => {
    sendMessageToOpponent();
});
