import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL;

// Create a singleton Redis client instance
const redisClient = createClient({
    url: REDIS_URL,
});

let isConnecting = false;

redisClient.on('connect', () => {
    console.log('Redis: connecting...');
});

redisClient.on('ready', () => {
    console.log('Redis: connection ready');
});

redisClient.on('reconnecting', () => {
    console.warn('Redis: reconnecting...');
});

redisClient.on('end', () => {
    console.log('Redis: connection closed');
});

redisClient.on('error', (err) => {
    console.error('Redis: connection error', err?.message || err);
});

export const connectRedis = async () => {
    if (redisClient.isOpen || isConnecting) return redisClient;
    try {
        isConnecting = true;
        await redisClient.connect();
        return redisClient;
    } catch (err) {
        console.error('Redis: failed to connect', err?.message || err);
        throw err;
    } finally {
        isConnecting = false;
    }
};

// Attempt connection on import, but don't crash app if it fails
(async () => {
    try {
        await connectRedis();
    } catch (_) {
        // Swallow to keep service import safe; logs already emitted
    }
})();

// Graceful shutdown
const shutdown = async () => {
    try {
        if (redisClient?.isOpen) {
            await redisClient.quit();
            console.log('Redis: quit gracefully');
        }
    } catch (err) {
        console.error('Redis: error during shutdown', err?.message || err);
    }
};

process.on('SIGINT', async () => {
    await shutdown();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await shutdown();
    process.exit(0);
});

export default redisClient;
