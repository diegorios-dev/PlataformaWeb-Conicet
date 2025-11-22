interface User {
  rol: string;
  name?: string;
  id?: string;
  email?: string;
}

export const storageService = {
  // USER MANAGEMENT (localStorage)
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  setUser: (user: User): void => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  },

  // SESSION FLAGS (sessionStorage)
  getNewLogin: (): boolean => {
    try {
      return sessionStorage.getItem('newLogin') === 'true';
    } catch (error) {
      console.error('Error reading newLogin from sessionStorage:', error);
      return false;
    }
  },

  setNewLogin: (): void => {
    try {
      sessionStorage.setItem('newLogin', 'true');
    } catch (error) {
      console.error('Error setting newLogin in sessionStorage:', error);
    }
  },

  removeNewLogin: (): void => {
    try {
      sessionStorage.removeItem('newLogin');
    } catch (error) {
      console.error('Error removing newLogin from sessionStorage:', error);
    }
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem('user');
      sessionStorage.removeItem('newLogin');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};
