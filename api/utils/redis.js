import { promisify } from 'util';

import redis from 'redis';

class RedisModel {
  constructor() {
    this.host = process.env.REDIS_HOST || '127.0.0.1';
    this.port = process.env.REDIS_PORT || 6379;

    this.client = null; // Initialize as null

    this.CACHE_EXPIRATION_SECONDS = 60; // Set the expiration time for cached data
  }

  // Open the Redis connection
  openConnection() {
    // this.client = redis.createClient({ host: this.host, port: this.port });
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    // Promisify Redis commands for the instance
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  // Close the Redis connection
  closeConnection() {
    if (this.client) {
      this.client.quit();
      this.client = null; // Reset to null after quitting
    }
  }

  // Method to check if the Redis server is alive
  isAlive() {
    return this.client.connected; // return true / false
  }

  // Store player data in Redis cache
  async storePlayer(playerId, data) {
    try {
      if (!this.client) {
        this.openConnection(); // Open the connection if not already open
      }

      const key = `player:${playerId}`;
      const serializedData = JSON.stringify(data);
      await this.setAsync(key, serializedData, 'EX', this.CACHE_EXPIRATION_SECONDS);
    } catch (error) {
      console.error('Error storing player data in Redis:', error);
    }
  }

  // Retrieve player data from Redis cache
  async getPlayer(playerId) {
    try {
      if (!this.client) {
        this.openConnection(); // Open the connection if not already open
      }

      const key = `player:${playerId}`;
      const cachedData = await this.getAsync(key);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error('Error retrieving player data from Redis:', error);
      return null;
    }
  }

  // Remove player data from Redis cache
  async removePlayer(playerId) {
    try {
      if (!this.client) {
        this.openConnection(); // Open the connection if not already open
      }

      const key = `player:${playerId}`;
      await this.delAsync(key);
    } catch (error) {
      console.error('Error removing player data from Redis:', error);
    }
  }

  // Get all logged-in players with pagination
  async getLoggedInPlayers(page = 1, pageSize = 10) {
    try {
      if (!this.client || !this.client.connected) {
        console.log('Reopening Redis connection in getLoggedInPlayers');
        this.openConnection(); // Open the connection if not already open
      }
  
      const cursor = '0'; // Start at the beginning
      const match = 'player:*';
      const count = pageSize;
      const players = [];
  
      // Use SCAN command for pagination
      const [newCursor, keys] = await this.client.scan(cursor, 'MATCH', match, 'COUNT', count);
  
      // Iterate through keys and fetch player data
      for await (const key of keys) {
        const cachedData = await this.getAsync(key);
        const playerData = cachedData ? JSON.parse(cachedData) : null;
        if (playerData) {
          players.push(playerData);
        }
      }
  
      // Determine if there's a next page based on keys length
      const nextPage = keys.length === count ? parseInt(newCursor, 10) : null;
  
      return {
        players,
        nextPage,
      };
    } catch (error) {
      console.error('Error getting logged-in players from Redis:', error);
      return null;
    }
  }  
}

const redisModel = new RedisModel();
export default redisModel;
