// ./models/ChatModel.js

class ChatModel {
  // Constructor to initialize the ChatModel with the provided Socket.IO instance
  constructor(io) {
    this.io = io;

    // Store messages in memory
    this.messages = [];
  }

  /**
   * Handles the sending of new chat messages.
   * @param {Object} player - The player object sending the message.
   * @param {string} message - The content of the message.
   */
  sendMessage(player, message) {
    // Get the current timestamp
    const timestamp = new Date();

    // Format the message with player details and timestamp
    const formattedMessage = { player, message, timestamp };

    // Add the formatted message to the list of messages
    this.messages.push(formattedMessage);

    // Broadcast the new message to all connected clients
    this.io.emit('newMessage', formattedMessage);
  }

  /**
   * Retrieves the entire chat history.
   * @returns {Array} - An array containing all chat messages.
   */
  getChatHistory() {
    return this.messages;
  }
}

// Export the ChatModel class
export default ChatModel;
