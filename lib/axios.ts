import axios from "axios";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: async (url: string) => {
    const res = await axiosInstance.get(url);
    return res.data;
  },

  post: async (url: string, data: unknown) => {
    const res = await axiosInstance.post(url, data);
    return res.data;
  },
};

export default axiosInstance;