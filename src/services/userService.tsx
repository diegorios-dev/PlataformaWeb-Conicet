import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getUser = async (password: string) => {
  const { data } = await axios.post(`${API_URL}/usuario`, {
    password, 
  });  
  return data;
};

export const getUsers = async () => {
  const { data } = await axios.get(`${API_URL}/usuarios`);  
  console.log(data)
  return data;
};

