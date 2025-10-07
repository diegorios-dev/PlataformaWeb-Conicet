import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const postNewUser = async (newUser) => {
  try {
    const { data } = await axios.post(`${API_URL}/user/register`, newUser);
    console.log("Usuario creado:", data);
    return data;
  } catch (error) {
    console.error("Error al crear usuario:", error.response?.data || error.message);
    throw error;
  }
};


export const login = async (password: string) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    password, 
  });  
  return data;
};

export const getAllUsers = async () => {
  const { data } = await axios.get(`${API_URL}/usuarios`);
  console.log(data)
  return data;
};

export const getUsersByWord = async (word = "") => {
  const { data } = await axios.get(`${API_URL}/usuario?word=${encodeURIComponent(word)}`);
  console.log(data);
  return data;
};



 export const saveUser = async (user) => {

  const payload = {
    name: user.name,
    rol: user.rol,
    password: user.password,
    latitude: user.site?.latitude,
    longitude: user.site?.longitude,
    locality: user.zona?.locality,
  };

  try {
    const { data } = await axios.put(`${API_URL}/usuario/${user.id}`, payload);
    console.log("Usuario actualizado:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
  
};