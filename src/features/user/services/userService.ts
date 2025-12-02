import axios from "axios";
import { API_URL } from "@config/api";
import { devLog, getErrorMessage } from "@shared/utils/errorHandler";
import { validateUserData } from "@shared/utils/validators";

const API_URL_SERVICE = API_URL;

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

    const { data } = await axios.post(`${API_URL_SERVICE}/user/register`, payload);
    
    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    return data;
  } catch (error) {
    devLog.error('Error creando nuevo usuario', error);
    throw new Error(getErrorMessage(error));
  }
};

export const login = async (password) => {
  try {
    const { data } = await axios.post(`${API_URL_SERVICE}/auth/login`, {
      password, 
    });
    
    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    return data;
  } catch (error) {
    devLog.error('Error en login', error);
    throw new Error(getErrorMessage(error));
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/usuarios`);
    
    // El backend retorna {users: [...]} o directamente un array
    // Retornar data tal cual para que el componente maneje la estructura
    return data;
  } catch (error) {
    devLog.error('Error obteniendo usuarios', error);
    throw new Error(getErrorMessage(error));
  }
};

export const getUsersByWord = async (word = "") => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/usuario?word=${encodeURIComponent(word)}`);
    
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

    const { data } = await axios.put(`${API_URL_SERVICE}/usuario/${user.id}`, payload);
    
    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    return data;
  } catch (error) {
    devLog.error(`Error guardando usuario ${user.id}`, error);
    throw new Error(getErrorMessage(error));
  }
};

export const deleteUser = async (userId : any) => {
  try {
    const { data } = await axios.delete(`${API_URL_SERVICE}/usuario/${userId}`);
    
    if (!data) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    return data;
  } catch (error) {
    devLog.error(`Error eliminando usuario ${userId}`, error);
    throw new Error(getErrorMessage(error));
  }
};
