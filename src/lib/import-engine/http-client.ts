import fs from 'fs';
import path from 'path';

export interface HttpClientOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  maxRetries?: number;
  retryDelayMs?: number;
  useMock?: boolean;
}

/**
 * A lightweight HTTP transport layer designed for Affiliate Connectors.
 * Handles retries, rate limiting (backoff), and JSON parsing.
 */
export class HttpClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private maxRetries: number;
  private retryDelayMs: number;
  public useMock: boolean;
  public mockFixtureMap: Record<string, string> = {}; // URL path -> local file path

  constructor(options: HttpClientOptions = {}) {
    this.baseURL = options.baseURL || '';
    this.headers = options.headers || {};
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelayMs = options.retryDelayMs ?? 1000;
    this.useMock = options.useMock ?? false;
  }

  public setHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  /**
   * Register a local JSON file to serve for a specific API path in mock mode.
   */
  public registerMockFixture(apiPath: string, fixtureFilePath: string) {
    this.mockFixtureMap[apiPath] = fixtureFilePath;
  }

  /**
   * Fetches data with exponential backoff on 429 and 5xx errors.
   */
  public async get<T = any>(apiPath: string, queryParams: Record<string, string> = {}): Promise<T> {
    if (this.useMock) {
      const fixturePath = this.mockFixtureMap[apiPath];
      if (!fixturePath) {
        throw new Error(`Mock Mode Error: No fixture registered for path ${apiPath}`);
      }
      
      console.log(`[Mock Mode] Loading fixture for ${apiPath} from ${fixturePath}`);
      const fileData = await fs.promises.readFile(fixturePath, 'utf8');
      return JSON.parse(fileData) as T;
    }

    const url = new URL(this.baseURL + apiPath);
    for (const [key, val] of Object.entries(queryParams)) {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, val);
      }
    }

    let attempt = 0;
    while (attempt <= this.maxRetries) {
      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: this.headers,
        });

        if (response.ok) {
          // Attempt to parse JSON, if it fails, throw
          const data = await response.json().catch(() => null);
          return data as T;
        }

        // Retryable errors: 429 Too Many Requests, or 500+ Server Errors
        if (response.status === 429 || response.status >= 500) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        // Non-retryable error
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Body: ${text}`);
      } catch (err) {
        attempt++;
        if (attempt > this.maxRetries) {
          throw err;
        }
        // Exponential backoff
        const delay = this.retryDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Unreachable');
  }

  /**
   * Posts data with exponential backoff on 429 and 5xx errors.
   */
  public async post<T = any>(apiPath: string, body: any): Promise<T> {
    const url = new URL(this.baseURL + apiPath);

    let attempt = 0;
    while (attempt <= this.maxRetries) {
      try {
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(body)
        });

        if (response.ok) {
          const data = await response.json().catch(() => null);
          return data as T;
        }

        if (response.status === 429 || response.status >= 500) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const text = await response.text().catch(() => '');
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}. Body: ${text}`);
      } catch (err) {
        attempt++;
        if (attempt > this.maxRetries) {
          throw err;
        }
        const delay = this.retryDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Unreachable');
  }
}
