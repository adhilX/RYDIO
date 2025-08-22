import { createClient, RedisClientType } from "redis";
import { IredisService } from "../../domain/interface/serviceInterface/IredisService";

export class RedisService implements IredisService {
    private _client: RedisClientType;

    constructor() {
        this._client = createClient({
            url: process.env.REDIS_URL ,
            socket: {
                reconnectStrategy: (retries: number) => {
                    if (retries > 10) return new Error('Too many retries');
                    return Math.min(retries * 100, 3000);
                }
            }
        });
        this._client.on('error', (err) => console.log('Redis client error:', err));
        this._client.on('connect', () => console.log('Redis connected'));
        this._client.on('end', () => console.log('Redis client disconnected')); 
    }

    public async connect(): Promise<void> {
        if (!this._client.isOpen) {
            await this._client.connect();
        }
    }

    public async disconnect(): Promise<void> {
        if (this._client.isOpen) {
            await this._client.quit();
        }
    }

    public async get(key: string): Promise<string | null> {
        if (!this._client.isOpen) {
            await this.connect();
        }
        if (!key) return null
        try {
            return await this._client.get(key);
        } catch (err) {
            console.error(`Error getting key ${key}:`, err);
            throw err;
        }
    }

    public async set(key: string, seconds: number, value: string): Promise<void> {
        if (!this._client.isOpen) {
            await this.connect();
        }
        try {
            await this._client.set(key, value, { EX: seconds });
        } catch (err) {
            console.error(`Error setting key ${key}:`, err);
            throw err;
        }
    }

    public async del(key: string): Promise<void> {
        if (!this._client.isOpen) {
            await this.connect();
        }
        if(!key) return
        try {
            await this._client.del(key);
        } catch (err) {
            console.error(`Error deleting key ${key}:`, err);
            throw err;
        }
    }
    public async setPermenant(key: string, value: string): Promise<void> {
        if (!this._client.isOpen) {
            await this.connect()
        }
        try {
            await this._client.set(key, value)
        } catch (err) {
            console.error(`Error setting Permenentkey ${key}:`, err);
            throw err;
        }
    }
    public getClient(): RedisClientType {
        return this._client;
    }
}

export default new RedisService();