import { API_CONFIG } from '../config/api';
import { retry } from './retry';

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'APIKey': API_CONFIG.API_KEY,
    'Content-Type': 'application/json',
  };

  const fetchWithTimeout = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${API_CONFIG.TIMEOUT}ms`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  };

  try {
    return await retry(fetchWithTimeout, API_CONFIG.MAX_RETRIES);
  } catch (error) {
    if (error instanceof Error) {
      console.error('API Error Details:', {
        message: error.message,
        status: (error as ApiError).status,
        statusText: (error as ApiError).statusText,
        url
      });
    }
    throw error;
  }
}