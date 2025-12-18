/**
 * Simple JWT Token Service
 * 
 * Stores and retrieves JWT token from localStorage
 */

const TOKEN_KEY = 'auth_token';

export const tokenService = {
  /**
   * Save token to localStorage
   */
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Get token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Remove token from localStorage
   */
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Check if token exists
   */
  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
