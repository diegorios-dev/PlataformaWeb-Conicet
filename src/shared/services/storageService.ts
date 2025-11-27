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
      return null;
    }
  },

  setUser: (user: User): void => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem('user');
    } catch (error) {
    }
  },

  // SESSION FLAGS (sessionStorage)
  getNewLogin: (): boolean => {
    try {
      return sessionStorage.getItem('newLogin') === 'true';
    } catch (error) {
      return false;
    }
  },

  setNewLogin: (): void => {
    try {
      sessionStorage.setItem('newLogin', 'true');
    } catch (error) {
    }
  },

  removeNewLogin: (): void => {
    try {
      sessionStorage.removeItem('newLogin');
    } catch (error) {
    }
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem('user');
      sessionStorage.removeItem('newLogin');
    } catch (error) {
    }
  }
};
