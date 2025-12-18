import axios, { AxiosRequestConfig } from 'axios';
import { API_URL } from '@config/api';
import { tokenService } from './tokenService';
import { storageService } from './storageService';

/**
 * HTTP Request Helper with JWT Support
 * 
 * Simple wrapper around axios that automatically adds JWT token to headers
 * and handles token expiration (401 errors)
 */

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired (401 Unauthorized), clear session and redirect to login
    if (error.response?.status === 401) {
      // Clear auth data
      tokenService.removeToken();
      storageService.removeUser();
      
      // Redirect to login page
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get authorization headers with JWT token
 */
const getAuthHeaders = () => {
  const token = tokenService.getToken();
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Content-Type': 'application/json',
  };
};

/**
 * HTTP GET request with JWT token
 */
export const httpGet = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosInstance.get<T>(url, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers,
    },
  });
  return response.data;
};

/**
 * HTTP POST request with JWT token
 */
export const httpPost = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosInstance.post<T>(url, data, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers,
    },
  });
  return response.data;
};

/**
 * HTTP PUT request with JWT token
 */
export const httpPut = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosInstance.put<T>(url, data, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers,
    },
  });
  return response.data;
};

/**
 * HTTP DELETE request with JWT token
 */
export const httpDelete = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosInstance.delete<T>(url, {
    ...config,
    headers: {
      ...getAuthHeaders(),
      ...config?.headers,
    },
  });
  return response.data;
};

/**
 * HTTP request without authentication (for public endpoints like login)
 */
export const httpPublic = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    axios.get<T>(`${API_URL}${url}`, config).then(res => res.data),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axios.post<T>(`${API_URL}${url}`, data, config).then(res => res.data),
};
