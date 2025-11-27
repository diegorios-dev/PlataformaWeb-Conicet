import axios from "axios";
import { API_URL } from "@config/api";

const API_URL_SERVICE = API_URL;

export interface Event {
  id: number;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/eventos`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getEventById = async (id: number): Promise<Event> => {
  try {
    const { data } = await axios.get(`${API_URL_SERVICE}/eventos/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
