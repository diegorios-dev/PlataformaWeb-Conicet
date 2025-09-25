import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getUser = async (password: string) => {
  const { data } = await axios.post(`${API_URL}/usuario`, {
    password, 
  });  
  return data;
};
