/**
 * API Service Layer for Core Banking System
 * Centralized HTTP client with error handling, retry logic, and response transformation
 */

import { API_BASE_URL, getAuthHeaders, API_ERROR_MESSAGES } from '@/config/api.config';
import { toast } from 'sonner';

// API Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// API Error Type
export class ApiError extends Error {
  statusCode: number;
  response?: any;

  constructor(message: string, statusCode: number, response?: any) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
    this.name = 'ApiError';
  }
}

// Request Configuration
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
  retries?: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Generic HTTP Request Handler
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { skipAuth, skipErrorToast, retries = 0, ...fetchConfig } = config;

    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...(skipAuth ? {} : getAuthHeaders()),
      ...fetchConfig.headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
      });

      // Handle different status codes
      if (!response.ok) {
        await this.handleErrorResponse(response, skipErrorToast);
      }

      // Parse response
      const data = await response.json();
      
      return {
        success: true,
        data: data.data || data,
        message: data.message,
        statusCode: response.status,
      };
    } catch (error) {
      // Retry logic for network errors
      if (retries > 0 && this.isNetworkError(error)) {
        console.warn(`Retrying request... (${retries} attempts left)`);
        return this.request<T>(endpoint, { ...config, retries: retries - 1 });
      }

      return this.handleError(error, skipErrorToast);
    }
  }

  /**
   * Handle Error Responses
   */
  private async handleErrorResponse(response: Response, skipErrorToast?: boolean) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || this.getErrorMessage(response.status);

    if (!skipErrorToast) {
      toast.error(message);
    }

    // Handle 401 Unauthorized - Redirect to login
    if (response.status === 401) {
      localStorage.removeItem('cbs_token');
      localStorage.removeItem('cbs_user');
      window.location.href = '/login';
    }

    throw new ApiError(message, response.status, errorData);
  }

  /**
   * Handle General Errors
   */
  private handleError(error: any, skipErrorToast?: boolean): ApiResponse {
    const message = error.message || API_ERROR_MESSAGES.SERVER_ERROR;
    
    if (!skipErrorToast) {
      toast.error(message);
    }

    return {
      success: false,
      error: message,
      statusCode: error.statusCode || 500,
    };
  }

  /**
   * Get Error Message by Status Code
   */
  private getErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case 401:
        return API_ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return API_ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return API_ERROR_MESSAGES.NOT_FOUND;
      case 422:
        return API_ERROR_MESSAGES.VALIDATION_ERROR;
      case 500:
        return API_ERROR_MESSAGES.SERVER_ERROR;
      default:
        return 'An error occurred. Please try again.';
    }
  }

  /**
   * Check if error is a network error
   */
  private isNetworkError(error: any): boolean {
    return (
      error instanceof TypeError ||
      error.message === 'Failed to fetch' ||
      error.message === 'Network request failed'
    );
  }

  /**
   * HTTP GET
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...config,
    });
  }

  /**
   * HTTP POST
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...config,
    });
  }

  /**
   * HTTP PUT
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...config,
    });
  }

  /**
   * HTTP PATCH
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...config,
    });
  }

  /**
   * HTTP DELETE
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...config,
    });
  }

  /**
   * Upload File
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers = getAuthHeaders();
    delete headers['Content-Type']; // Let browser set it for FormData

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  /**
   * Download File
   */
  async downloadFile(endpoint: string, filename?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('File download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download file');
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export convenience methods
export const { get, post, put, patch, delete: del, uploadFile, downloadFile } = apiService;
