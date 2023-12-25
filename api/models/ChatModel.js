// ./models/ChatModel.js

class ChatModel {
  constructor(io) {
    this.io = io;

    // Store messages in memory (you might want to use a database in a real application)
    this.messages = [];
  }

  // Method to handle new messages
  sendMessage(player, message) {
    const timestamp = new Date();
    const formattedMessage = { player, message, timestamp };

    // Add the message to the list
    this.messages.push(formattedMessage);

    // Broadcast the new message to all connected clients
    this.io.emit('newMessage', formattedMessage);
  }

  // Method to get all chat messages
  getChatHistory() {
    return this.messages;
  }
}

export default ChatModel;
