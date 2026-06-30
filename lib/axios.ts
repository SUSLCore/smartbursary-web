import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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

  put: async (url: string, data: unknown) => {
    const res = await axiosInstance.put(url, data);
    return res.data;
  },

  delete: async (url: string) => {
    const res = await axiosInstance.delete(url);
    return res.data;
  },
};


axiosInstance.interceptors.response.use(

    (response) => response,

    (error) => {

        if (axios.isAxiosError(error)) {

            return Promise.reject(
                error.response?.data ?? {
                    success: false,
                    message: "Unexpected server error.",
                }
            );

        }

        return Promise.reject(error);

    }

);

export default axiosInstance;
