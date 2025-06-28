import { createClient, RedisClientType } from "redis";
import { IredisService } from "../../domain/interface/serviceInterface/IredisService";

export class RedisService implements IredisService {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: {
                reconnectStrategy: (retries: number) => {
                    if (retries > 10) return new Error('Too many retries');
                    return Math.min(retries * 100, 3000);
                }
            }
        });
        this.client.on('error', (err) => console.log('Redis client error:', err));
        this.client.on('connect', () => console.log('Redis connected'));
        this.client.on('end', () => console.log('Redis client disconnected')); 
    }

    public async connect(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    public async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }

    public async get(key: string): Promise<string | null> {
        if (!this.client.isOpen) {
            await this.connect();
        }
        if (!key) return null
        try {
            return await this.client.get(key);
        } catch (err) {
            console.error(`Error getting key ${key}:`, err);
            throw err;
        }
    }

    public async set(key: string, seconds: number, value: string): Promise<void> {
        if (!this.client.isOpen) {
            await this.connect();
        }
        try {
            await this.client.set(key, value, { EX: seconds });
        } catch (err) {
            console.error(`Error setting key ${key}:`, err);
            throw err;
        }
    }

    public async del(key: string): Promise<void> {
        if (!this.client.isOpen) {
            await this.connect();
        }
        if(!key) return
        try {
            await this.client.del(key);
        } catch (err) {
            console.error(`Error deleting key ${key}:`, err);
            throw err;
        }
    }
    public async setPermenant(key: string, value: string): Promise<void> {
        if (!this.client.isOpen) {
            await this.connect()
        }
        try {
            await this.client.set(key, value)
        } catch (err) {
            console.error(`Error setting Permenentkey ${key}:`, err);
            throw err;
        }
    }
    public getClient(): RedisClientType {
        return this.client;
    }
}

export default new RedisService();