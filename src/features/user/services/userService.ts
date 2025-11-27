import axios from "axios";
import { API_URL } from "@config/api";

const API_URL_SERVICE = API_URL;

export const postNewUser = async (newUser) => {
  try {
    // Ahora enviamos site_id y zona_id directamente
    const payload = {
      name: newUser.name,
      password: newUser.password,
      rol: newUser.rol,
      site_id: newUser.site_id,
      zona_id: newUser.zona_id
    };

    const { data } = await axios.post(`${API_URL_SERVICE}/user/register`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (password) => {
  const { data } = await axios.post(`${API_URL_SERVICE}/auth/login`, {
    password, 
  });  
  return data;
};

export const getAllUsers = async () => {
  const { data } = await axios.get(`${API_URL_SERVICE}/usuarios`);
  return data;
};

export const getUsersByWord = async (word = "") => {
  const { data } = await axios.get(`${API_URL_SERVICE}/usuario?word=${encodeURIComponent(word)}`);
  return data;
};

export const saveUser = async (user) => {
  const payload = {
    name: user.name,
    rol: user.rol,
    password: user.password,
    site_id: user.site_id,    // Enviar el ID del sitio
    zona_id: user.zona_id,    // Enviar el ID de la zona
  };

  try {
    const { data } = await axios.put(`${API_URL_SERVICE}/usuario/${user.id}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const { data } = await axios.delete(`${API_URL_SERVICE}/usuario/${userId}`);
    return data;
  } catch (error) {
    throw error;
  }
};
