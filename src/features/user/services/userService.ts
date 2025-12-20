import { httpGet, httpPost, httpPut, httpDelete, httpPublic } from '@shared/services';
import { tokenService } from '@shared/services';
import { getCachedData, cache } from '@shared/utils/simpleCache';
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";
import { validateUserData } from "@shared/utils/validators";

const MAESTROS_TTL = 10 * 60 * 1000; // 10 minutos (datos relativamente estables)

export const postNewUser = async (newUser) => {
  try {
    // Validar datos antes de enviar
    const validationError = validateUserData(newUser);
    if (validationError) {
      throw new Error(validationError);
    }

    // Ahora enviamos site_id y zona_id directamente
    const payload = {
      name: newUser.name.trim(),
      password: newUser.password,
      rol: newUser.rol.toLowerCase(),
      site_id: Number(newUser.site_id),
      zona_id: Number(newUser.zona_id)
    };

    const data = await httpPost(`/v1/users`, payload);
    
    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    // Invalidar cache de usuarios
    cache.invalidate('maestros:users');
    
    return data;
  } catch (error) {
    devLog.error('Error creando nuevo usuario', error);
    throw new Error(getErrorMessage(error));
  }
};

export const login = async (password) => {
  try {
    const data = await httpPublic.post(`/v1/auth/login`, {
      password, 
    });
    
    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    // Store JWT token - support both 'token' and 'access_token' from backend
    const token = data.token

    if (token) {
      tokenService.setToken(token);
    } else {
      console.warn('⚠️ Backend response does not contain token or access_token:', data);
    }
    
    return data;
  } catch (error) {
    devLog.error('Error en login', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Obtiene todos los usuarios del sistema (con cache)
 * Cache: 10 minutos (datos que cambian con moderación)
 */
export const getAllUsers = async () => {
  return getCachedData(
    'maestros:users',
    async () => {
      try {
        const data = await httpGet(`/v1/users`);
        
        // El backend retorna {users: [...]} o directamente un array
        // Retornar data tal cual para que el componente maneje la estructura
        return data;
      } catch (error) {
        devLog.error('Error obteniendo usuarios', error);
        throw new Error(getErrorMessage(error));
      }
    },
    MAESTROS_TTL
  );
};

export const getUsersByWord = async (word = "") => {
  try {
    const data = await httpGet(`/v1/users/search?word=${encodeURIComponent(word)}`);
    
    // El backend retorna {users: [...]} o directamente un array
    // Retornar data tal cual para que el componente maneje la estructura
    return data;
  } catch (error) {
    devLog.error('Error buscando usuarios', error);
    throw new Error(getErrorMessage(error));
  }
};

export const saveUser = async (user : any) => {
  try {
    // Validar solo campos requeridos (zona_id es opcional al editar)
    const validationError = validateUserData({
      name: user.name,
      password: user.password,
      rol: user.rol,
      site_id: user.site_id,
    }, false); // false = zona_id es opcional

    if (validationError) {
      throw new Error(validationError);
    }

    const payload = {
      name: user.name.trim(),
      rol: user.rol.toLowerCase(),
      password: user.password,
      site_id: Number(user.site_id),
      zona_id: user.zona_id ? Number(user.zona_id) : null, // Enviar null si no tiene zona
    };

    const data = await httpPut(`/v1/users/${user.id}`, payload);
    
    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    // Invalidar cache de usuarios
    cache.invalidate('maestros:users');
    
    return data;
  } catch (error) {
    devLog.error(`Error guardando usuario ${user.id}`, error);
    throw new Error(getErrorMessage(error));
  }
};

export const deleteUser = async (userId : any) => {
  try {
    const data = await httpDelete(`/v1/users/${userId}`);
    
    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    // Invalidar cache de usuarios
    cache.invalidate('maestros:users');
    
    return data;
  } catch (error) {
    devLog.error(`Error eliminando usuario ${userId}`, error);
    throw new Error(getErrorMessage(error));
  }
};
