import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getInstruments = async () => {
  const { data } = await axios.get(`${API_URL}/instrumentos`);
  return data;
};
